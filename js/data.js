/*
 * data.js — שכבת הנתונים: משיכה חיה מגוגל שיטס (xlsx), פתיחת ה-zip בדפדפן,
 * ושרשרת גיבויים: רשת → מטמון מקומי → fallback.json הארוז באתר.
 */
import { buildModel, exportUrl } from './parser.js';

// מטמון נפרד לכל מחזור
const cacheKey = (cycle) => `flipper.model.v3.c${cycle.id}`;

/* ---------- unzip בדפדפן: DataView + DecompressionStream ---------- */

async function inflateRaw(bytes) {
  const ds = new DecompressionStream('deflate-raw');
  const stream = new Blob([bytes]).stream().pipeThrough(ds);
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function unzipXlsx(buf) {
  const bytes = new Uint8Array(buf);
  const view = new DataView(buf);
  let eocd = -1;
  for (let i = bytes.length - 22; i >= 0; i--) {
    if (view.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('not a zip');
  const count = view.getUint16(eocd + 10, true);
  let off = view.getUint32(eocd + 16, true);
  const files = {};
  const utf8 = new TextDecoder('utf-8');
  for (let i = 0; i < count; i++) {
    if (view.getUint32(off, true) !== 0x02014b50) throw new Error('bad central dir');
    const method = view.getUint16(off + 10, true);
    const csize = view.getUint32(off + 20, true);
    const nameLen = view.getUint16(off + 28, true);
    const extraLen = view.getUint16(off + 30, true);
    const commentLen = view.getUint16(off + 32, true);
    const localOff = view.getUint32(off + 42, true);
    const name = utf8.decode(bytes.subarray(off + 46, off + 46 + nameLen));
    if (name.endsWith('.xml') || name.endsWith('.rels')) {
      const lNameLen = view.getUint16(localOff + 26, true);
      const lExtraLen = view.getUint16(localOff + 28, true);
      const dataStart = localOff + 30 + lNameLen + lExtraLen;
      const raw = bytes.subarray(dataStart, dataStart + csize);
      files[name] = utf8.decode(method === 8 ? await inflateRaw(raw) : raw);
    }
    off += 46 + nameLen + extraLen + commentLen;
  }
  return files;
}

/* ---------- שרשרת הטעינה ---------- */

async function fetchLive(cycle) {
  const res = await fetch(`${exportUrl(cycle.sheetId)}&t=${Date.now()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`sheet fetch failed: ${res.status}`);
  const files = await unzipXlsx(await res.arrayBuffer());
  const model = buildModel(files);
  if (!model.days.length) throw new Error('parsed 0 days');
  model.fetchedAt = new Date().toISOString();
  model.source = 'live';
  model.cycleId = cycle.id;
  return model;
}

function readCache(cycle) {
  try {
    const raw = localStorage.getItem(cacheKey(cycle));
    if (!raw) return null;
    const model = JSON.parse(raw);
    return model.days && model.days.length ? model : null;
  } catch { return null; }
}

function writeCache(cycle, model) {
  try { localStorage.setItem(cacheKey(cycle), JSON.stringify(model)); } catch { /* מלא — לא נורא */ }
}

async function fetchBundled(cycle) {
  const res = await fetch(`data/fallback-${cycle.id}.json`);
  const model = await res.json();
  model.source = 'bundled';
  model.cycleId = cycle.id;
  return model;
}

/**
 * טוען מודל ומדווח דרך onModel(model) — ייתכנו שתי קריאות:
 * קודם מהמטמון (מיידי), ואז מהרשת (עדכני).
 */
export async function loadModel(onModel, cycle) {
  const cached = readCache(cycle);
  if (cached) {
    cached.source = 'cache';
    onModel(cached);
  }
  try {
    const live = await fetchLive(cycle);
    writeCache(cycle, live);
    onModel(live);
  } catch (err) {
    console.warn('live sheet fetch failed:', err);
    if (!cached) {
      try { onModel(await fetchBundled(cycle)); }
      catch (e2) { console.error('bundled fallback failed too:', e2); }
    }
  }
}

/* רענון שקט כל 5 דקות, בכל חזרה לאפליקציה, ובלחיצה יזומה */
export function startAutoRefresh(onModel, cycle) {
  let inFlight = false;
  const refresh = async () => {
    if (inFlight) return false;
    inFlight = true;
    try {
      const live = await fetchLive(cycle);
      writeCache(cycle, live);
      onModel(live);
      return true;
    } catch {
      return false; // שקט — נשארים עם מה שיש
    } finally {
      inFlight = false;
    }
  };
  setInterval(refresh, 5 * 60 * 1000);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') refresh();
  });
  // ספארי באייפון מחזיר עמודים מהזיכרון (bfcache) בלי visibilitychange
  window.addEventListener('pageshow', (e) => { if (e.persisted) refresh(); });
  return refresh;
}

/* ---------- הודעות הפס הרץ (Supabase) ---------- */

import { SUPABASE, hasSupabase } from './config.js';

/** קריאה ציבורית: הודעות פעילות בלבד (RLS). מחזיר [] כשאין חיבור. */
export async function fetchTickerMessages() {
  if (!hasSupabase()) return [];
  try {
    const res = await fetch(
      `${SUPABASE.url}/rest/v1/flipper_messages?select=day,text,level,sort&active=eq.true&order=sort&order=created_at`,
      { headers: { apikey: SUPABASE.key } },
    );
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

/** פעולת ניהול (list/add/update/delete) — נבדקת בצד השרת מול קוד האדמין. */
export async function adminOp(adminCode, op, msg = {}, msgId = null) {
  if (!hasSupabase()) throw new Error('אין חיבור הודעות: חסר מפתח ב-js/config.js');
  const res = await fetch(`${SUPABASE.url}/rest/v1/rpc/flipper_admin_op`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE.key,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ admin_code: adminCode, op, msg, msg_id: msgId }),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const hint = body && body.message ? body.message : `HTTP ${res.status}`;
    throw new Error(hint.includes('unauthorized') ? 'קוד אדמין שגוי' : hint);
  }
  return body;
}

/* ---------- עמוד המדריכים ---------- */

/** מושך את הגיליון החי ומחזיר את כל הלשוניות כפי שהן (לרשימות חניכים וצוות). */
export async function loadRawSheets(cycle) {
  const res = await fetch(`${exportUrl(cycle.sheetId)}&t=${Date.now()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`sheet fetch failed: ${res.status}`);
  const files = await unzipXlsx(await res.arrayBuffer());
  const { loadWorkbook } = await import('./parser.js');
  return loadWorkbook(files);
}

/** פעולת צוות (נוכחות/הערות) — הקוד נבדק בצד השרת. */
export async function staffOp(staffCode, op, payload = {}) {
  if (!hasSupabase()) throw new Error('אין חיבור: חסר מפתח ב-js/config.js');
  const res = await fetch(`${SUPABASE.url}/rest/v1/rpc/flipper_staff_op`, {
    method: 'POST',
    headers: { apikey: SUPABASE.key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ staff_code: staffCode, op, payload }),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const hint = body && body.message ? body.message : `HTTP ${res.status}`;
    throw new Error(hint.includes('unauthorized') ? 'קוד צוות שגוי' : hint);
  }
  return body;
}

/* ---------- זמן ישראל ---------- */

export function israelNow() {
  // לבדיקות ותצוגה מקדימה: ?now=2026-08-02T10:30 מקפיא את השעון
  const fake = new URLSearchParams(location.search).get('now');
  if (fake) {
    const m = fake.match(/^(\d{4}-\d{2}-\d{2})T(\d{1,2}):(\d{2})$/);
    if (m) return { date: m[1], minutes: parseInt(m[2], 10) * 60 + parseInt(m[3], 10) };
  }
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jerusalem',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t).value;
  const hour = parseInt(get('hour'), 10) % 24;
  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    minutes: hour * 60 + parseInt(get('minute'), 10),
  };
}
