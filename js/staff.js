/* staff.js — אזור הצוות: נוכחות, הערות ואנשי קשר */

import { loadRawSheets, staffOp, israelNow } from './data.js';
import { parseStaffData } from './parser.js';
import { LOGO, groupAvatar, groupStyle } from './icons.js';

const CODE_KEY = 'flipper.staff.code';
const WHO_KEY = 'flipper.staff.who';

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const state = {
  code: localStorage.getItem(CODE_KEY) || '',
  who: localStorage.getItem(WHO_KEY) || '',   // שם הלשונית של המדריך.ה
  data: null,        // parseStaffData
  days: [],          // ימי הקייטנה מהמודל הראשי
  dayIndex: 0,
  att: new Map(),    // child -> {present, note}
  notes: [],
  saving: new Set(),
};

/* ---------- מסכים ---------- */

function show(screen) {
  $('staff-gate').hidden = screen !== 'gate';
  $('staff-who').hidden = screen !== 'who';
  $('staff-app').hidden = screen !== 'app';
}

/* ---------- כניסה ---------- */

async function tryEnter(code) {
  await staffOp(code, 'ping');
  state.code = code;
  localStorage.setItem(CODE_KEY, code);
}

$('sg-enter').addEventListener('click', async () => {
  const code = $('sg-code').value.trim();
  if (!code) return;
  $('sg-err').textContent = '';
  try {
    await tryEnter(code);
    afterAuth();
  } catch (err) {
    $('sg-err').textContent = err.message;
  }
});
$('sg-code').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('sg-enter').click(); });

/* ---------- בחירת מדריך.ה ---------- */

function renderWho() {
  $('who-grid').innerHTML = state.data.groups.map((g, i) => {
    const gs = groupStyle(i);
    return `
      <button class="who-card" data-tab="${esc(g.tab)}">
        <span class="avatar" style="background:${gs.soft};color:${gs.color}">${groupAvatar(i)}</span>
        <span class="w-name">${esc(g.tab)}</span>
        <span class="w-sub">${esc(g.groupLabel || g.instructorFull || '')}</span>
      </button>`;
  }).join('');
}

$('who-grid').addEventListener('click', (e) => {
  const card = e.target.closest('.who-card');
  if (!card) return;
  state.who = card.dataset.tab;
  localStorage.setItem(WHO_KEY, state.who);
  enterApp();
});

$('who-switch').addEventListener('click', () => { renderWho(); show('who'); });

/* ---------- ימי הקייטנה ---------- */

function todayIndex() {
  const { date } = israelNow();
  const i = state.days.findIndex((d) => d.date === date);
  if (i >= 0) return i;
  return date < state.days[0]?.date ? 0 : Math.max(state.days.length - 1, 0);
}

function renderDays() {
  const { date } = israelNow();
  $('staff-days').innerHTML = state.days.map((d, i) => `
    <button class="day-chip ${i === state.dayIndex ? 'active' : ''} ${d.date === date ? 'today' : ''}" data-i="${i}">
      <span class="d-letter">יום ${d.dayLetter}׳</span>
      <span class="d-date">${esc(d.dateLabel)}</span>
    </button>`).join('');
}

$('staff-days').addEventListener('click', async (e) => {
  const chip = e.target.closest('.day-chip');
  if (!chip) return;
  state.dayIndex = parseInt(chip.dataset.i, 10);
  renderDays();
  await loadDay();
});

/* ---------- נוכחות ---------- */

const group = () => state.data.groups.find((g) => g.tab === state.who);
const dayLabel = () => state.days[state.dayIndex]?.dateLabel || '';

async function loadDay() {
  state.att = new Map();
  state.notes = [];
  renderRoster();
  try {
    const res = await staffOp(state.code, 'get_day', { day: dayLabel(), instructor: state.who });
    for (const a of res.attendance) state.att.set(a.child, { present: a.present, note: a.note });
    state.notes = res.notes;
  } catch (err) {
    $('staff-sync').textContent = 'שגיאה בטעינת נוכחות: ' + err.message;
  }
  renderRoster();
  renderNotes();
}

function renderSummary() {
  const g = group();
  if (!g) return;
  const total = g.children.length;
  const present = g.children.filter((c) => state.att.get(c.name)?.present === true).length;
  const absent = g.children.filter((c) => state.att.get(c.name)?.present === false).map((c) => c.name);
  $('att-summary').innerHTML = `
    <span class="cnt">${present}/${total}</span> נוכחים היום
    ${absent.length ? `<span class="missing">חסרים: ${esc(absent.join(', '))}</span>` : ''}`;
}

function renderRoster() {
  const g = group();
  if (!g) return;
  renderSummary();
  $('roster').innerHTML = g.children.map((c) => {
    const a = state.att.get(c.name) || {};
    const stateCls = a.present === true ? 'present-yes' : a.present === false ? 'absent' : '';
    return `
      <div class="child ${stateCls}" data-child="${esc(c.name)}">
        ${c.health ? `<span class="health-flag" title="הערה רפואית">!</span>` : ''}
        <div class="c-info">
          <div class="c-name">${esc(c.name)}<span class="age">${esc(c.age)}</span></div>
          <div class="c-parent">
            ${c.parent ? esc(c.parent) : ''}${c.parent && c.phone ? ' · ' : ''}
            ${c.phone ? `<a href="tel:${esc(c.phone)}">${esc(c.phone)}</a>` : ''}
          </div>
          ${c.health ? `<div class="c-health">⚕️ ${esc(c.health)}</div>` : ''}
          ${a.note ? `<div class="c-note-text">📝 ${esc(a.note)}</div>` : ''}
        </div>
        <button class="note-btn" data-act="note" title="הערה על החניך.ה">📝</button>
        <div class="att-toggle">
          <button data-act="yes" class="${a.present === true ? 'on-yes' : ''}">✓</button>
          <button data-act="no" class="${a.present === false ? 'on-no' : ''}">✗</button>
        </div>
      </div>`;
  }).join('');
}

$('roster').addEventListener('click', async (e) => {
  const row = e.target.closest('.child');
  if (!row) return;
  const child = row.dataset.child;

  if (e.target.closest('.health-flag')) { row.classList.toggle('open'); return; }

  const btn = e.target.closest('button[data-act]');
  if (!btn) return;
  const act = btn.dataset.act;

  if (act === 'note') {
    const current = state.att.get(child)?.note || '';
    const note = prompt(`הערה על ${child}:`, current);
    if (note == null) return;
    const entry = state.att.get(child) || {};
    entry.note = note.trim();
    state.att.set(child, entry);
    renderRoster();
    try { await staffOp(state.code, 'set_child_note', { day: dayLabel(), instructor: state.who, child, note: note.trim() }); }
    catch (err) { alert('השמירה נכשלה: ' + err.message); }
    return;
  }

  // נוכחות: לחיצה חוזרת על אותו מצב מנקה אותו
  const entry = state.att.get(child) || {};
  const target = act === 'yes';
  entry.present = entry.present === target ? null : target;
  state.att.set(child, entry);
  renderRoster();
  try { await staffOp(state.code, 'set_attendance', { day: dayLabel(), instructor: state.who, child, present: entry.present }); }
  catch (err) { alert('השמירה נכשלה: ' + err.message); }
});

/* ---------- הערות היום ---------- */

function renderNotes() {
  $('day-notes').innerHTML = state.notes.length
    ? state.notes.map((n) => `
      <div class="day-note" data-id="${n.id}">
        <div>
          <div>${esc(n.note)}</div>
          <div class="n-time">${new Date(n.created_at).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jerusalem' })}</div>
        </div>
        <button class="n-del" title="מחיקה">✕</button>
      </div>`).join('')
    : '<p style="font-size:13px;color:var(--ink-soft)">אין עדיין הערות ליום הזה.</p>';
}

$('note-add').addEventListener('click', async () => {
  const note = $('note-input').value.trim();
  if (!note) return;
  $('note-input').value = '';
  try {
    const saved = await staffOp(state.code, 'add_note', { day: dayLabel(), instructor: state.who, note });
    state.notes.push(saved);
    renderNotes();
  } catch (err) { alert('השמירה נכשלה: ' + err.message); }
});
$('note-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('note-add').click(); });

$('day-notes').addEventListener('click', async (e) => {
  const del = e.target.closest('.n-del');
  if (!del) return;
  const id = del.closest('.day-note').dataset.id;
  if (!confirm('למחוק את ההערה?')) return;
  try {
    await staffOp(state.code, 'del_note', { id });
    state.notes = state.notes.filter((n) => n.id !== id);
    renderNotes();
  } catch (err) { alert('המחיקה נכשלה: ' + err.message); }
});

/* ---------- אנשי קשר ---------- */

function renderContacts() {
  $('staff-contacts').innerHTML = state.data.staff.map((s) => `
    <div class="contact-row">
      <span>${esc(s.name)}</span>
      <span class="r-role">${esc(s.role)}</span>
      ${s.phone ? `<a href="tel:${esc(s.phone)}">${esc(s.phone)}</a>` : ''}
    </div>`).join('') || '<p style="font-size:13px">לא נמצאה טבלת צוות בגיליון.</p>';
}

/* ---------- הרכבה ---------- */

async function enterApp() {
  show('app');
  const g = group();
  const gi = state.data.groups.indexOf(g);
  $('staff-logo').innerHTML = LOGO();
  $('staff-title').textContent = `${state.who} · ${g?.groupLabel || 'הקבוצה שלי'}`;
  $('staff-sub').textContent = g?.instructorFull && g.instructorFull !== state.who ? g.instructorFull : 'אזור הצוות';
  renderDays();
  renderContacts();
  await loadDay();
  $('staff-sync').textContent = `${group()?.children.length || 0} חניכים ברשימה · הנתונים חיים מהגיליון`;
}

async function afterAuth() {
  // טוען את הגיליון: רשימות + ימי השבוע
  const sheets = await loadRawSheets();
  state.data = parseStaffData(sheets);
  // ימי השבוע מתוך שמות הלשוניות
  const dayModel = { days: [] };
  for (const s of sheets) {
    const m = s.name.match(/יום\s+([אבגדהוש])\s+(\d{1,2})\.(\d{1,2})/);
    if (m) dayModel.days.push({
      dayLetter: m[1],
      dateLabel: `${parseInt(m[2], 10)}.${parseInt(m[3], 10)}`,
      date: `2026-${String(parseInt(m[3], 10)).padStart(2, '0')}-${String(parseInt(m[2], 10)).padStart(2, '0')}`,
    });
  }
  dayModel.days.sort((a, b) => a.date.localeCompare(b.date));
  state.days = dayModel.days;
  state.dayIndex = todayIndex();

  if (state.who && state.data.groups.some((g) => g.tab === state.who)) {
    enterApp();
  } else {
    renderWho();
    show('who');
  }
}

/* ---------- יציאה לדרך ---------- */

$('sg-logo').innerHTML = LOGO();

(async () => {
  if (state.code) {
    try {
      await staffOp(state.code, 'ping');
      await afterAuth();
      return;
    } catch { localStorage.removeItem(CODE_KEY); }
  }
  show('gate');
})();
