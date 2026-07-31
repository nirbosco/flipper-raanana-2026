/* app.js — הלוגיקה של אפליקציית הלו"ז */

import { loadModel, startAutoRefresh, israelNow } from './data.js';
import {
  icon, categoryMeta, groupAvatar, groupColor, LOGO, CATEGORY_META,
} from './icons.js';
import { SHEET_URL } from './parser.js';

const GROUPS_KEY = 'flipper.groups.v1';
const PICKUP_SHORT = 13 * 60 + 30;
const PICKUP_LONG = 16 * 60;

const $ = (id) => document.getElementById(id);

const state = {
  model: null,
  selected: JSON.parse(localStorage.getItem(GROUPS_KEY) || '[]'),
  dayIndex: 0,
  dayChosenByUser: false,
};

/* ---------- עזרים ---------- */

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function todayIndex(model) {
  const { date } = israelNow();
  const i = model.days.findIndex((d) => d.date === date);
  if (i >= 0) return i;
  // לפני תחילת השבוע — היום הראשון; אחרי — האחרון
  return date < model.days[0].date ? 0 : model.days.length - 1;
}

const selectedGroups = () =>
  state.model.groups.filter((g) => state.selected.includes(g.name));

/* ---------- שער כניסה ---------- */

function groupCardHTML(g, selected) {
  const gc = groupColor(g.name);
  return `
    <button class="group-card ${selected ? 'selected' : ''}" data-group="${esc(g.name)}" style="--gc:${gc.color}">
      <span class="tick">✓</span>
      <span class="avatar" style="background:${gc.soft};color:${gc.color}">${groupAvatar(g.name)}</span>
      <span class="g-name">${esc(g.name)}</span>
      <span class="g-ages">${esc(g.ages)}</span>
    </button>`;
}

function bindGroupGrid(container, onChange) {
  container.addEventListener('click', (e) => {
    const card = e.target.closest('.group-card');
    if (!card) return;
    card.classList.toggle('selected');
    onChange([...container.querySelectorAll('.group-card.selected')].map((c) => c.dataset.group));
  });
}

function showGate() {
  $('gate').hidden = false;
  $('app').hidden = true;
  $('gate-logo').innerHTML = LOGO();
  $('gate-groups').innerHTML = state.model.groups.map((g) => groupCardHTML(g, state.selected.includes(g.name))).join('');
  $('gate-cta').disabled = state.selected.length === 0;
}

let gateBound = false;
function bindGate() {
  if (gateBound) return;
  gateBound = true;
  bindGroupGrid($('gate-groups'), (names) => {
    state.selected = names;
    $('gate-cta').disabled = names.length === 0;
  });
  $('gate-cta').addEventListener('click', () => {
    localStorage.setItem(GROUPS_KEY, JSON.stringify(state.selected));
    $('gate').hidden = true;
    $('app').hidden = false;
    renderApp();
  });
}

/* ---------- טיקר ---------- */

const DEFAULT_MESSAGES = [
  { text: 'בוקר טוב! לא לשכוח: קרם הגנה, כובע ובקבוק מים', level: 'important' },
  { text: 'איסוף יום קצר בשעה 13:30, איסוף יום ארוך בשעה 16:00', level: 'normal' },
];

function activeMessages() {
  const day = state.model.days[state.dayIndex];
  const msgs = (state.model.messages || []).filter((m) => {
    const dateOk = !m.date || m.date.trim() === day.dateLabel || m.date.trim() === day.date;
    const groupOk = !m.group || state.selected.includes(m.group);
    return dateOk && groupOk;
  });
  const list = msgs.length ? msgs : DEFAULT_MESSAGES;
  if (day.theme) list.push({ text: `היום בקייטנה: ${day.theme}`, level: 'normal' });
  return list;
}

function renderTicker() {
  const msgs = activeMessages();
  const ticker = $('ticker');
  if (!msgs.length) { ticker.hidden = true; return; }
  ticker.hidden = false;
  const items = msgs.map((m) => `
    <span class="ticker-item ${m.level === 'important' ? 'important' : ''}">
      <span class="dot"></span>${esc(m.text)}${m.group ? ` <b>(${esc(m.group)})</b>` : ''}
    </span>`).join('');
  // שתי עותקים ללולאה חלקה
  $('ticker-track').innerHTML = items + items;
  const chars = msgs.reduce((n, m) => n + m.text.length, 0);
  $('ticker-track').style.setProperty('--ticker-dur', `${Math.max(18, chars * 0.55)}s`);
}

/* ---------- ניווט ימים ---------- */

const DAY_NAMES = { 'א': 'ראשון', 'ב': 'שני', 'ג': 'שלישי', 'ד': 'רביעי', 'ה': 'חמישי', 'ו': 'שישי', 'ש': 'שבת' };

function renderDays() {
  const { date } = israelNow();
  $('days').innerHTML = state.model.days.map((d, i) => `
    <button class="day-chip ${i === state.dayIndex ? 'active' : ''} ${d.date === date ? 'today' : ''}" data-i="${i}">
      <span class="d-letter">יום ${d.dayLetter}׳</span>
      <span class="d-date">${esc(d.dateLabel)}</span>
    </button>`).join('');
  const active = $('days').querySelector('.day-chip.active');
  if (active) active.scrollIntoView({ block: 'nearest', inline: 'center' });
}

/* ---------- באנר עכשיו ---------- */

function nowInfo() {
  const { date, minutes } = israelNow();
  const day = state.model.days[state.dayIndex];
  if (day.date !== date) return null;
  if (minutes < 8 * 60 || minutes > PICKUP_LONG + 30) return null;
  const rows = selectedGroups().map((g) => {
    const acts = day.activities.filter((a) => a.groups.includes(g.name));
    const current = acts.find((a) => a.startMin <= minutes && minutes < a.endMin);
    const next = acts.find((a) => a.startMin > minutes);
    return { group: g, current, next };
  });
  return { minutes, rows };
}

function renderNowBanner() {
  const info = nowInfo();
  const banner = $('now-banner');
  if (!info || !info.rows.length) { banner.hidden = true; return; }
  banner.hidden = false;
  const rowsHTML = info.rows.map(({ group, current, next }) => {
    const gc = groupColor(group.name);
    if (current) {
      const meta = categoryMeta(current.category);
      const pct = Math.round(((info.minutes - current.startMin) / (current.endMin - current.startMin)) * 100);
      return `
        <div class="nb-row">
          <span class="nb-icon" style="background:${meta.soft};color:${meta.color}">${icon(current.category)}</span>
          <div class="nb-info">
            <div class="nb-group" style="color:${gc.color}">${esc(group.name)} עכשיו</div>
            <div class="nb-label">${esc(current.label)}</div>
            <div class="nb-time">${current.start}–${current.end}</div>
            <div class="nb-progress"><i style="width:${pct}%"></i></div>
          </div>
        </div>`;
    }
    if (next) {
      const meta = categoryMeta(next.category);
      return `
        <div class="nb-row">
          <span class="nb-icon" style="background:${meta.soft};color:${meta.color}">${icon(next.category)}</span>
          <div class="nb-info">
            <div class="nb-group" style="color:${gc.color}">${esc(group.name)} בהמשך</div>
            <div class="nb-label">${esc(next.label)}</div>
            <div class="nb-time">מתחיל בשעה ${next.start}</div>
          </div>
        </div>`;
    }
    return `
      <div class="nb-row">
        <span class="nb-icon" style="background:${groupColor(group.name).soft};color:${gc.color}">${groupAvatar(group.name)}</span>
        <div class="nb-info">
          <div class="nb-group" style="color:${gc.color}">${esc(group.name)}</div>
          <div class="nb-label">היום הסתיים, נתראה מחר!</div>
        </div>
      </div>`;
  }).join('');
  banner.innerHTML = `
    <div class="nb-head"><span class="pulse"></span>קורה עכשיו בקייטנה</div>
    <div class="nb-rows">${rowsHTML}</div>`;
}

/* ---------- ציר הזמן ---------- */

function renderTimeline() {
  const day = state.model.days[state.dayIndex];
  const groups = selectedGroups();
  const timeline = $('timeline');
  timeline.classList.toggle('multi', groups.length > 1);
  timeline.classList.toggle('multi3', groups.length > 2);

  const acts = day.activities;
  const dayStart = Math.min(8 * 60 + 30, ...acts.map((a) => a.startMin));
  const dayEnd = Math.max(PICKUP_LONG, ...acts.map((a) => a.endMin));
  const pxPerMin = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--min-px')) || 2.3;
  const y = (min) => (min - dayStart) * pxPerMin;
  const height = y(dayEnd) + 8;

  // ציר שעות
  let gutter = '';
  let lines = '';
  for (let t = Math.ceil(dayStart / 30) * 30; t <= dayEnd; t += 30) {
    const isHour = t % 60 === 0;
    const label = `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
    gutter += `<div class="tl-mark ${isHour ? 'hour' : ''}" style="top:${y(t)}px">${label}</div>`;
    lines += `<div class="tl-line" style="top:${y(t)}px"></div>`;
  }

  const { date, minutes } = israelNow();
  const isToday = day.date === date;
  const showNowLine = isToday && minutes >= dayStart - 15 && minutes <= dayEnd + 15;

  const cols = groups.map((g) => {
    const gc = groupColor(g.name);
    const mine = day.activities.filter((a) => a.groups.includes(g.name));
    const cards = mine.map((a) => {
      const meta = categoryMeta(a.category);
      const h = (a.endMin - a.startMin) * pxPerMin;
      const compact = h < 46;
      const isNow = isToday && a.startMin <= minutes && minutes < a.endMin;
      return `
        <div class="act ${compact ? 'compact' : ''} ${isNow ? 'now-active' : ''}"
             style="top:${y(a.startMin)}px;height:${Math.max(h - 4, 26)}px;--col:${meta.color};--soft:${meta.soft}">
          ${isNow ? '<span class="now-tag">עכשיו</span>' : ''}
          <span class="a-icon">${icon(a.category)}</span>
          <span class="a-body">
            <div class="a-time">${a.start}–${a.end}</div>
            <div class="a-label">${esc(a.label)}</div>
          </span>
        </div>`;
    }).join('');
    return `
      <div class="tl-col">
        <div class="tl-col-head" style="--gcol:${gc.color};--gsoft:${gc.soft}">
          ${groupAvatar(g.name)} ${esc(g.name)} <span class="ages">${esc(g.ages)}</span>
        </div>
        <div class="tl-canvas" style="height:${height}px">
          ${lines}
          <div class="pickup-line" style="top:${y(PICKUP_SHORT)}px"><span>איסוף יום קצר 13:30</span></div>
          <div class="pickup-line" style="top:${y(PICKUP_LONG)}px"><span>איסוף יום ארוך 16:00</span></div>
          ${cards}
          ${showNowLine ? `<div class="now-line" style="top:${y(minutes)}px"></div>` : ''}
        </div>
      </div>`;
  }).join('');

  timeline.innerHTML = `
    <div class="tl-gutter">
      <div class="tl-col-head" style="visibility:hidden">.</div>
      <div class="tl-canvas" style="height:${height}px">${gutter}</div>
    </div>
    ${cols}`;
}

function scrollToNow() {
  const el = document.querySelector('.now-line') || document.querySelector('.act.now-active');
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.38;
    window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
  }
}

/* ---------- מקרא ---------- */

function renderLegend() {
  const day = state.model.days[state.dayIndex];
  const used = new Set(day.activities.map((a) => a.category));
  const items = [...used].filter((c) => CATEGORY_META[c]).map((c) => {
    const meta = categoryMeta(c);
    return `
      <div class="legend-item">
        <span class="sw" style="--col:${meta.color};--soft:${meta.soft};color:${meta.color};background:${meta.soft}">${icon(c)}</span>
        ${esc(meta.label)}
      </div>`;
  }).join('');
  $('legend').innerHTML = `<h3>מה כל צבע אומר?</h3><div class="legend-grid">${items}</div>`;
}

/* ---------- הגדרות ---------- */

function openSettings() {
  $('settings-groups').innerHTML = state.model.groups
    .map((g) => groupCardHTML(g, state.selected.includes(g.name))).join('');
  $('settings-sheet').classList.add('open');
  $('sheet-backdrop').classList.add('open');
}

function closeSettings() {
  $('settings-sheet').classList.remove('open');
  $('sheet-backdrop').classList.remove('open');
}

/* ---------- הרכבה ---------- */

function syncStickyOffset() {
  const h = $('sticky-stack').offsetHeight;
  document.documentElement.style.setProperty('--sticky-top', `${h + 6}px`);
}

function renderApp() {
  const day = state.model.days[state.dayIndex];
  $('top-logo').innerHTML = LOGO();
  $('top-theme').textContent = day.theme
    ? `יום ${DAY_NAMES[day.dayLetter] || day.dayLetter} ${day.dateLabel} · ${day.theme}`
    : `יום ${DAY_NAMES[day.dayLetter] || day.dayLetter} ${day.dateLabel}`;
  renderTicker();
  renderDays();
  renderNowBanner();
  renderTimeline();
  renderLegend();
  renderSyncNote();
  requestAnimationFrame(syncStickyOffset);
}

function renderSyncNote() {
  const note = $('sync-note');
  const m = state.model;
  if (m.source === 'live') {
    const t = new Date(m.fetchedAt);
    note.textContent = `מסונכרן עם הלו"ז המרכזי · ${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`;
    note.classList.remove('stale');
  } else {
    note.textContent = 'מציג לו"ז שמור, מתעדכן ברגע שיש חיבור';
    note.classList.add('stale');
  }
}

function onModel(model) {
  const firstLoad = !state.model;
  state.model = model;
  if (!state.dayChosenByUser) state.dayIndex = todayIndex(model);
  if (firstLoad) {
    bindGate();
    if (!state.selected.length) {
      showGate();
    } else {
      $('app').hidden = false;
      renderApp();
      setTimeout(scrollToNow, 350);
    }
  } else if (!$('app').hidden) {
    renderApp();
  }
}

/* ---------- אירועים ---------- */

$('days').addEventListener('click', (e) => {
  const chip = e.target.closest('.day-chip');
  if (!chip) return;
  state.dayIndex = parseInt(chip.dataset.i, 10);
  state.dayChosenByUser = true;
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

$('settings-btn').addEventListener('click', openSettings);
$('sheet-backdrop').addEventListener('click', closeSettings);
bindGroupGrid($('settings-groups'), (names) => { state.selected = names; });
$('sheet-save').addEventListener('click', () => {
  if (!state.selected.length) return closeSettings();
  localStorage.setItem(GROUPS_KEY, JSON.stringify(state.selected));
  closeSettings();
  renderApp();
});

/* החלקה בין ימים */
let touchX = null;
document.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
document.addEventListener('touchend', (e) => {
  if (touchX == null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  touchX = null;
  if (Math.abs(dx) < 70 || $('app').hidden) return;
  if (document.querySelector('.timeline.multi') && selectedGroups().length > 2) return; // יש גלילה אופקית פנימית
  const dir = dx > 0 ? 1 : -1; // RTL: החלקה ימינה = היום הבא
  const next = state.dayIndex + dir;
  if (next >= 0 && next < state.model.days.length) {
    state.dayIndex = next;
    state.dayChosenByUser = true;
    renderApp();
  }
}, { passive: true });

/* עדכון "עכשיו" כל חצי דקה */
setInterval(() => {
  if (!state.model || $('app').hidden) return;
  renderNowBanner();
  renderTimeline();
}, 30 * 1000);

/* ---------- יציאה לדרך ---------- */

loadModel(onModel);
startAutoRefresh(onModel);
