/*
 * parser.js — הפרסר המשותף של לו"ז קייטנת פליפר.
 * רץ גם בדפדפן וגם ב-Node (מחולל ה-fallback), לכן אין תלות ב-DOM.
 * קלט: קבצי ה-XML מתוך ה-xlsx (אחרי unzip). פלט: מודל הנתונים של האפליקציה.
 */

export const SHEET_ID = '1soicEw_7X2vz8ju3w3yOKLGMW0bmz6VznIb7MUGSpXI';
export const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`;
export const EXPORT_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=xlsx`;
export const CAMP_YEAR = 2026;

const DAY_TAB_RE = /יום\s+([אבגדהוש])\s+(\d{1,2})\.(\d{1,2})/;
const TIME_RE = /^(\d{1,2}):(\d{2})$/;
const RANGE_RE = /\(?\s*(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})\s*\)?/;

/* ---------- XML helpers (regex-based, xlsx XML is machine-generated and regular) ---------- */

function decodeEntities(s) {
  return s
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

function textOfTags(xml) {
  // concat every <t ...>text</t> in the fragment
  let out = '';
  const re = /<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g;
  let m;
  while ((m = re.exec(xml))) out += decodeEntities(m[1]);
  return out;
}

function attr(tag, name) {
  const m = tag.match(new RegExp(`${name}="([^"]*)"`));
  return m ? decodeEntities(m[1]) : null;
}

function colRowFromRef(ref) {
  const m = ref.match(/([A-Z]+)(\d+)/);
  let col = 0;
  for (const ch of m[1]) col = col * 26 + (ch.charCodeAt(0) - 64);
  return { col: col - 1, row: parseInt(m[2], 10) - 1 };
}

/* ---------- workbook loading ---------- */

/**
 * files: { 'xl/workbook.xml': string, ... } — decoded UTF-8 texts of the xlsx entries.
 * returns [{ name, cells: Map('r,c' -> text), merges: [{r1,c1,r2,c2}] }]
 */
export function loadWorkbook(files) {
  const shared = [];
  const ss = files['xl/sharedStrings.xml'];
  if (ss) {
    const re = /<si>([\s\S]*?)<\/si>/g;
    let m;
    while ((m = re.exec(ss))) shared.push(textOfTags(m[1]));
  }

  const relmap = {};
  const relXml = files['xl/_rels/workbook.xml.rels'] || '';
  for (const tag of relXml.match(/<Relationship\b[^>]*>/g) || []) {
    relmap[attr(tag, 'Id')] = attr(tag, 'Target');
  }

  const sheets = [];
  for (const tag of (files['xl/workbook.xml'] || '').match(/<sheet\b[^>]*>/g) || []) {
    const rid = attr(tag, 'r:id');
    let target = (relmap[rid] || '').replace(/^\//, '');
    if (!target.startsWith('xl/')) target = 'xl/' + target;
    sheets.push({ name: (attr(tag, 'name') || '').trim(), target });
  }

  for (const sheet of sheets) {
    const xml = files[sheet.target] || '';
    const cells = new Map();
    const cellRe = /<c\s([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g;
    let m;
    while ((m = cellRe.exec(xml))) {
      const head = m[1], body = m[2] || '';
      const ref = attr('<c ' + head + '>', 'r');
      if (!ref) continue;
      const type = attr('<c ' + head + '>', 't');
      let text = null;
      const v = body.match(/<v>([\s\S]*?)<\/v>/);
      if (type === 'inlineStr') text = textOfTags(body);
      else if (v) text = type === 's' ? shared[parseInt(v[1], 10)] : decodeEntities(v[1]);
      if (text == null || !text.trim()) continue;
      const { col, row } = colRowFromRef(ref);
      cells.set(row + ',' + col, text.trim());
    }
    const merges = [];
    const mergeRe = /<mergeCell ref="([^"]+)"/g;
    while ((m = mergeRe.exec(xml))) {
      const [a, b] = m[1].split(':');
      const p = colRowFromRef(a), q = colRowFromRef(b);
      merges.push({ r1: p.row, c1: p.col, r2: q.row, c2: q.col });
    }
    sheet.cells = cells;
    sheet.merges = merges;
  }
  return sheets;
}

/* ---------- classification ---------- */

const CATEGORIES = [
  ['artistic', ['שחייה אומנותית', 'שחיה אומנותית']],
  ['waterpolo', ['כדור מים', 'כדור-מים', 'כדורמים']],
  ['swim', ['שיעור שחייה', 'שיעור שחיה']],
  ['freeswim', ['זמן משחק בבריכה', 'מים חופשיים', 'זמן חופשי בבריכה', 'משחק בבריכה']],
  ['closing', ['איסוף', 'סיום יום', 'סיכום', 'התארגנות סוף']],
  ['food', ['ארוחת', 'הפסקת מים', 'פירות', 'צהריים', 'ארוחה']],
  ['movie', ['סרט', 'פופקורן', 'הקרנת']],
  ['defense', ['הגנה עצמית']],
  ['treasure', ['חפש את המטמון', 'מטמון']],
  ['games', ["ג'ימבורי", 'משחקי שליחים', 'משחקי קופסא', 'משחקי קופסה', 'משחקים']],
  ['guest', ['שיחה עם', 'אורח']],
  ['rest', ['מנוחה']],
  ['opening', ['פתיחת יום', 'שיחת פתיחה', 'בוקר טוב', 'נוכחות', 'היכרות', 'נהלים']],
  ['transition', ['התארגנות ומעבר', 'מעבר ל', 'התארגנות']],
];

export function classify(label) {
  for (const [cat, keys] of CATEGORIES) {
    for (const k of keys) if (label.includes(k)) return cat;
  }
  return 'activity';
}

/* ---------- day parsing ---------- */

function cellTime(text) {
  const m = text.match(TIME_RE);
  if (m) return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
  const v = parseFloat(text);
  if (!Number.isNaN(v) && v > 0 && v < 1) return Math.round(v * 24 * 60);
  return null;
}

const fmt = (min) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;

/**
 * כותרת עמודת קבוצה, בכל הפורמטים שהגיליון עבר ויעבור:
 *   "יעל (גילאי 6-7)"                      → name=יעל, ages=גילאי 6-7
 *   "קבוצת דולפינים - יעל - גילאי 6-7"     → name=קבוצת דולפינים, instructor=יעל, ages=גילאי 6-7
 *   "דולפינים (יעל, גילאי 6-7)"            → name=דולפינים, instructor=יעל, ages=גילאי 6-7
 */
export function parseGroupHeader(text) {
  const clean = text.replace(/\s+/g, ' ').trim();
  const isAges = (s) => /גיל|\d\s*[-–]\s*\d/.test(s);
  const paren = clean.match(/^(.+?)\s*\(([^)]*)\)\s*$/);
  if (paren) {
    const inner = paren[2].split(/[,،]/).map((s) => s.trim()).filter(Boolean);
    const ages = inner.find(isAges) || '';
    const instructor = inner.find((s) => s !== ages) || '';
    return { name: paren[1].trim(), instructor, ages };
  }
  const parts = clean.split(/\s[-–|·]\s/).map((s) => s.trim()).filter(Boolean);
  if (parts.length >= 2) {
    const ages = parts.find(isAges) || '';
    const rest = parts.filter((p) => p !== ages);
    return { name: rest[0] || clean, instructor: rest[1] || '', ages };
  }
  return { name: clean, instructor: '', ages: '' };
}

function parseDay(sheet) {
  const tabMatch = sheet.name.match(DAY_TAB_RE);
  if (!tabMatch) return null;
  const [, dayLetter, dd, mm] = tabMatch;
  const { cells, merges } = sheet;

  let headerRow = null;
  for (const [key, text] of cells) {
    const [r, c] = key.split(',').map(Number);
    if (c === 0 && text === 'שעה') { headerRow = r; break; }
  }
  if (headerRow == null) return null;

  const groups = [];
  for (let col = 1; col < 12; col++) {
    const text = cells.get(headerRow + ',' + col);
    if (!text) continue;
    groups.push({ col, ...parseGroupHeader(text) });
  }

  const grid = [];
  for (let row = headerRow + 1; ; row++) {
    const text = cells.get(row + ',0');
    if (text == null) {
      const probe = [row + 1, row + 2].some((r) => {
        const t = cells.get(r + ',0');
        return t != null && cellTime(t) != null;
      });
      if (!probe) break;
      continue;
    }
    const t = cellTime(text);
    if (t == null) break;
    grid.push([row, t]);
  }
  if (!grid.length) return null;

  const rowTime = new Map(grid);
  const gridRows = grid.map(([r]) => r);
  const step = grid.length > 1 ? grid[1][1] - grid[0][1] : 15;
  const endOfRow = (r) => {
    const i = gridRows.indexOf(r);
    return i + 1 < grid.length ? grid[i + 1][1] : grid[i][1] + step;
  };
  const mergeFor = (r, c) =>
    merges.find((m) => m.r1 <= r && r <= m.r2 && m.c1 <= c && c <= m.c2) || null;

  const groupCols = new Set(groups.map((g) => g.col));
  const activities = [];
  const seen = new Set();
  const sortedCells = [...cells.entries()].sort((a, b) => {
    const [ra, ca] = a[0].split(',').map(Number);
    const [rb, cb] = b[0].split(',').map(Number);
    return ra - rb || ca - cb;
  });

  for (const [key, text] of sortedCells) {
    const [r, c] = key.split(',').map(Number);
    if (!rowTime.has(r) || !groupCols.has(c)) continue;
    const mg = mergeFor(r, c);
    const dedupeKey = mg ? `${mg.r1},${mg.c1}` : key;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    const r1 = mg ? mg.r1 : r, r2 = mg ? mg.r2 : r;
    const c1 = mg ? mg.c1 : c, c2 = mg ? mg.c2 : c;
    let start = rowTime.get(r1) ?? rowTime.get(r);
    const lastGridRow = gridRows.filter((rr) => rr <= r2).pop() ?? r1;
    let end = endOfRow(lastGridRow);

    let label = text;
    const flat = label.replace(/\n/g, ' ');
    const tr = flat.match(RANGE_RE);
    let timeSource = 'grid';
    if (tr) {
      start = parseInt(tr[1], 10) * 60 + parseInt(tr[2], 10);
      end = parseInt(tr[3], 10) * 60 + parseInt(tr[4], 10);
      if (end <= start) end += 12 * 60;
      label = flat.replace(RANGE_RE, ' ');
      timeSource = 'explicit';
    }
    label = label.replace(/\s+/g, ' ').replace(/^[\s\-–]+|[\s\-–]+$/g, '').trim();

    const covered = groups.filter((g) => c1 <= g.col && g.col <= c2);
    activities.push({
      start: fmt(start), end: fmt(end), startMin: start, endMin: end,
      label,
      groups: covered.map((g) => g.name),
      cols: covered.map((g) => g.col),
      category: classify(label), timeSource,
    });
  }

  // חיתוך חפיפות בתוך קבוצה: טווח מפורש שמתחיל באמצע פעילות-גריד מקצר אותה.
  for (const g of groups) {
    const mine = activities
      .filter((a) => a.cols.includes(g.col))
      .sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin);
    for (let i = 0; i < mine.length - 1; i++) {
      const a = mine[i], b = mine[i + 1];
      if (a.endMin > b.startMin && a.startMin < b.startMin && a.timeSource === 'grid') {
        // הפעילות משותפת לכמה קבוצות? מפצלים רק אם החיתוך זהה לכולן, אחרת משאירים.
        a.endMin = b.startMin;
        a.end = fmt(a.endMin);
      }
    }
  }

  activities.sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin);

  const title = cells.get('0,0') || '';
  const intro = cells.get('1,0') || '';
  let theme = null;
  const themeMatch = title.match(/[-–]\s*(.+)$/);
  const titleDay = title.match(DAY_TAB_RE);
  if (themeMatch && titleDay && titleDay[1] === dayLetter) theme = themeMatch[1].trim();

  return {
    tab: sheet.name,
    dayLetter,
    date: `${CAMP_YEAR}-${String(parseInt(mm, 10)).padStart(2, '0')}-${String(parseInt(dd, 10)).padStart(2, '0')}`,
    dateLabel: `${parseInt(dd, 10)}.${parseInt(mm, 10)}`,
    theme, intro,
    groups: groups.map((g) => ({ col: g.col, name: g.name, instructor: g.instructor || '', ages: g.ages })),
    activities,
  };
}

/* ---------- messages tab ---------- */

function parseMessages(sheet) {
  const { cells } = sheet;
  const rows = [...new Set([...cells.keys()].map((k) => parseInt(k, 10)))].sort((a, b) => a - b);
  const msgs = [];
  for (const r of rows) {
    const text = (cells.get(r + ',2') || '').trim();
    if (!text) continue;
    const first = (cells.get(r + ',0') || '').trim();
    if (first === 'תאריך' || first === 'יום') continue;
    msgs.push({
      date: first || null,
      group: (cells.get(r + ',1') || '').trim() || null,
      text,
      level: (cells.get(r + ',3') || '').includes('חשוב') ? 'important' : 'normal',
    });
  }
  return msgs;
}

/* ---------- עמוד המדריכים: רשימות חניכים וצוות ---------- */

function normalizePhone(raw) {
  if (!raw) return '';
  let s = String(raw).trim();
  // מספרים שנשמרו בגיליון כמספר עשרוני (5.86281105E8) או בלי אפס מוביל
  if (/^[\d.eE+]+$/.test(s) && /[.eE]/.test(s)) {
    const n = Math.round(parseFloat(s));
    if (!Number.isFinite(n)) return '';
    s = String(n);
  }
  s = s.replace(/[^\d]/g, '');
  if (!s) return '';
  if (!s.startsWith('0')) s = '0' + s;
  return s;
}

/**
 * לשוניות המדריכים ("יעל", "מיה"...) + לשונית "נוכחות חניכים וצוות".
 * מחזיר: { groups: [{tab, instructorFull, groupLabel, children:[...]}], staff: [...] }
 * הרוסטר המלא (טלפון + שם הורה) מגיע מלשונית הנוכחות; השיוך לקבוצה מהלשוניות האישיות.
 */
export function parseStaffData(sheets) {
  const rosterSheet = sheets.find((s) => s.name.includes('נוכחות'));

  // לשוניות מדריכים: שורת "מדריכה: X" למעלה + עמודת "קבוצה"
  const groups = [];
  for (const s of sheets) {
    if (s.name.includes('יום') || s.name.includes('נוכחות') || s.name.includes('הודעות')) continue;
    let instructorFull = null, groupLabel = null, headerRow = null, nameCol = null, groupCol = null;
    for (const [key, text] of s.cells) {
      const [r, c] = key.split(',').map(Number);
      const m = text.match(/^מדריכ[הת.ה]*\s*:\s*(.+)$/);
      if (m) instructorFull = m[1].trim();
      if (text === 'שם') { headerRow = r; nameCol = c; }
    }
    if (headerRow == null) continue;
    for (let c = 0; c < 15; c++) {
      if ((s.cells.get(headerRow + ',' + c) || '').trim() === 'קבוצה') { groupCol = c; break; }
    }
    const children = [];
    const rows = [...new Set([...s.cells.keys()].map((k) => parseInt(k, 10)))].sort((a, b) => a - b);
    for (const r of rows) {
      if (r <= headerRow) continue;
      const name = (s.cells.get(r + ',' + nameCol) || '').trim();
      if (!name) continue;
      if (!groupLabel && groupCol != null) groupLabel = (s.cells.get(r + ',' + groupCol) || '').trim() || null;
      children.push(name);
    }
    if (children.length) {
      groups.push({ tab: s.name, instructorFull: instructorFull || s.name, groupLabel, childNames: children });
    }
  }

  // לשונית הנוכחות: פרטים מלאים לכל חניך + טבלת צוות
  const rosterByName = new Map();
  const rosterByGroup = new Map();
  const staff = [];
  if (rosterSheet) {
    const cells = rosterSheet.cells;
    const rows = [...new Set([...cells.keys()].map((k) => parseInt(k, 10)))].sort((a, b) => a - b);
    // כותרות החניכים (שורה עם "שם" ו"קבוצה") וכותרות הצוות (שורה עם "שם מלא" ו"תפקיד")
    let childHeader = null, staffHeader = null;
    const headerMap = (r) => {
      const map = {};
      for (let c = 0; c < 15; c++) {
        const t = (cells.get(r + ',' + c) || '').trim();
        if (t) map[t] = c;
      }
      return map;
    };
    for (const r of rows) {
      const map = headerMap(r);
      if (map['שם'] != null && map['קבוצה'] != null && !childHeader) childHeader = { row: r, map };
      if (map['שם מלא'] != null && map['תפקיד'] != null) staffHeader = { row: r, map };
    }
    for (const r of rows) {
      if (childHeader && r > childHeader.row && (!staffHeader || r < staffHeader.row)) {
        const m = childHeader.map;
        const name = (cells.get(r + ',' + m['שם']) || '').trim();
        if (!name) continue;
        const child = {
          name,
          group: (cells.get(r + ',' + m['קבוצה']) || '').trim(),
          age: (cells.get(r + ',' + (m['גיל'] ?? -1)) || '').trim(),
          phone: normalizePhone(cells.get(r + ',' + (m['טלפון'] ?? -1)) || ''),
          parent: (cells.get(r + ',' + (m['שם הורה'] ?? m['הורה'] ?? 8)) || '').trim(),
          health: (cells.get(r + ',' + (m['הצהרת בריאות / הערה'] ?? m['הערה'] ?? -1)) || '').trim(),
          stay: (cells.get(r + ',' + (m['משך שהות'] ?? -1)) || '').trim(),
        };
        rosterByName.set(name, child);
        if (child.group) {
          if (!rosterByGroup.has(child.group)) rosterByGroup.set(child.group, []);
          rosterByGroup.get(child.group).push(child);
        }
      }
      if (staffHeader && r > staffHeader.row) {
        const m = staffHeader.map;
        const name = (cells.get(r + ',' + m['שם מלא']) || '').trim();
        if (!name) continue;
        staff.push({
          name,
          role: (cells.get(r + ',' + m['תפקיד']) || '').trim(),
          phone: normalizePhone(cells.get(r + ',' + (m['טלפון'] ?? -1)) || ''),
        });
      }
    }
  }

  // איחוד: הלשונית האישית קובעת את הרשימה והסדר; פרטים מלאים מלשונית הנוכחות.
  // חניך שמופיע בלשונית הנוכחות תחת הקבוצה אבל חסר בלשונית האישית מצטרף בסוף.
  for (const g of groups) {
    const seen = new Set();
    g.children = g.childNames.map((name) => {
      seen.add(name);
      return rosterByName.get(name) || {
        name, group: g.groupLabel || '', age: '', phone: '', parent: '', health: '', stay: '',
      };
    });
    if (g.groupLabel) {
      for (const c of rosterByGroup.get(g.groupLabel) || []) {
        if (!seen.has(c.name)) g.children.push(c);
      }
    }
    delete g.childNames;
  }

  return { groups, staff };
}

/* ---------- entry point ---------- */

export function buildModel(files) {
  const sheets = loadWorkbook(files);
  const days = [];
  let messages = [];
  for (const s of sheets) {
    if (s.name.includes('הודעות')) { messages = parseMessages(s); continue; }
    const d = parseDay(s);
    if (d) days.push(d);
  }
  days.sort((a, b) => a.date.localeCompare(b.date));
  return {
    sheetId: SHEET_ID,
    groups: days.length ? days[0].groups : [],
    days, messages,
  };
}
