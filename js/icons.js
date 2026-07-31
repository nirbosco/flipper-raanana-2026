/* icons.js — ספריית אייקונים מצוירת לקייטנת פליפר. SVG בלבד, בלי ספריות. */

const S = (inner, vb = '0 0 24 24') =>
  `<svg viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;

export const ICONS = {
  /* שמש עולה מעל גל — פתיחת יום */
  opening: S(`
    <circle cx="12" cy="10" r="3.6" fill="currentColor" fill-opacity=".18"/>
    <path d="M12 3.2v1.6M18.2 5.8l-1.1 1.1M20.8 12h-1.6M5.8 5.8l1.1 1.1M3.2 12h1.6"/>
    <path d="M2.5 17c1.6 0 2.4-1.3 4-1.3S8.9 17 10.5 17s2.4-1.3 4-1.3 2.4 1.3 4 1.3 2.4-1.3 3-1.3"/>
    <path d="M4 20.5c1.6 0 2.4-1.3 4-1.3s2.4 1.3 4 1.3 2.4-1.3 4-1.3 2.4 1.3 4 1.3"/>`),

  /* שחיין בתנועה — שיעור שחייה */
  swim: S(`
    <circle cx="17.2" cy="6.8" r="2" fill="currentColor" fill-opacity=".18"/>
    <path d="M3.5 12.5l5.2-3.2c.8-.5 1.8-.3 2.4.4l3 3.4"/>
    <path d="M9.5 9.7l4.2 1.2 4.6-1.4"/>
    <path d="M2.5 17c1.6 0 2.4-1.3 4-1.3S8.9 17 10.5 17s2.4-1.3 4-1.3 2.4 1.3 4 1.3 2.4-1.3 3-1.3"/>
    <path d="M4 20.5c1.6 0 2.4-1.3 4-1.3s2.4 1.3 4 1.3 2.4-1.3 4-1.3 2.4 1.3 4 1.3"/>`),

  /* רגל מונפת מהמים עם נצנוץ — שחייה אומנותית */
  artistic: S(`
    <path d="M10 16.5V8.2c0-1.8 1-3.2 2.6-3.2 1.2 0 2 .8 2.2 1.9"/>
    <path d="M10 10.5c1.8-.2 3.4-1.2 4.4-2.6"/>
    <path d="M18.5 4.5l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5z" fill="currentColor" stroke-width="1"/>
    <path d="M4.5 6.2l.4 1 1 .4-1 .4-.4 1-.4-1-1-.4 1-.4z" fill="currentColor" stroke-width=".8"/>
    <path d="M2.5 17c1.6 0 2.4-1.3 4-1.3S8.9 17 10.5 17s2.4-1.3 4-1.3 2.4 1.3 4 1.3 2.4-1.3 3-1.3"/>
    <path d="M4 20.5c1.6 0 2.4-1.3 4-1.3s2.4 1.3 4 1.3 2.4-1.3 4-1.3 2.4 1.3 4 1.3"/>`),

  /* כדור צף על מים — כדור-מים */
  waterpolo: S(`
    <circle cx="12" cy="10" r="4.5" fill="currentColor" fill-opacity=".14"/>
    <path d="M12 5.5v9M8.2 7.2c2.4 1.7 5.2 1.7 7.6 0M8.2 12.8c2.4-1.7 5.2-1.7 7.6 0"/>
    <path d="M2.5 17c1.6 0 2.4-1.3 4-1.3S8.9 17 10.5 17s2.4-1.3 4-1.3 2.4 1.3 4 1.3 2.4-1.3 3-1.3"/>
    <path d="M4 20.5c1.6 0 2.4-1.3 4-1.3s2.4 1.3 4 1.3 2.4-1.3 4-1.3 2.4 1.3 4 1.3"/>`),

  /* התזות ובועות — מים חופשיים */
  freeswim: S(`
    <path d="M12 4.5c-2.6 2.9-4.2 5.2-4.2 7.3a4.2 4.2 0 108.4 0c0-2.1-1.6-4.4-4.2-7.3z" fill="currentColor" fill-opacity=".16"/>
    <circle cx="5.2" cy="7.5" r="1.1"/>
    <circle cx="19" cy="6.5" r=".9"/>
    <circle cx="18.4" cy="11.5" r=".7"/>
    <path d="M4 20.5c1.6 0 2.4-1.3 4-1.3s2.4 1.3 4 1.3 2.4-1.3 4-1.3 2.4 1.3 4 1.3"/>`),

  /* אבטיח — ארוחות והפסקות */
  food: S(`
    <path d="M3.5 12.5a8.5 8.5 0 0017 0z" fill="currentColor" fill-opacity=".16"/>
    <path d="M5.8 12.5a6.2 6.2 0 0012.4 0"/>
    <circle cx="9.4" cy="15" r=".5" fill="currentColor"/>
    <circle cx="12" cy="16.4" r=".5" fill="currentColor"/>
    <circle cx="14.6" cy="15" r=".5" fill="currentColor"/>
    <path d="M12 12.5V21"/>`),

  /* כדור ודגלון — משחקים וספורט */
  games: S(`
    <circle cx="9" cy="15.5" r="4.2" fill="currentColor" fill-opacity=".16"/>
    <path d="M9 11.3v8.4M5.4 13.2c2.2 1.5 5 1.5 7.2 0M5.4 17.8c2.2-1.5 5-1.5 7.2 0"/>
    <path d="M16.5 19.5V4.5l4.5 2.2-4.5 2.2"/>`),

  /* מגן — הגנה עצמית */
  defense: S(`
    <path d="M12 3.5l6.5 2.4v5.2c0 4.3-2.8 7.6-6.5 9.4-3.7-1.8-6.5-5.1-6.5-9.4V5.9z" fill="currentColor" fill-opacity=".14"/>
    <path d="M9 11.8l2.2 2.2 4-4.4"/>`),

  /* מפת אוצר — חפש את המטמון */
  treasure: S(`
    <path d="M4 6.5l5-2 6 2 5-2v13l-5 2-6-2-5 2z" fill="currentColor" fill-opacity=".12"/>
    <path d="M9 4.5v13M15 6.5v13"/>
    <path d="M11.2 10.2l2.4 2.4M13.6 10.2l-2.4 2.4"/>`),

  /* פופקורן — סרט */
  movie: S(`
    <path d="M6.5 9.5L8 20h8l1.5-10.5" fill="currentColor" fill-opacity=".14"/>
    <path d="M6.5 9.5h11M9.7 9.5L10.4 20M14.3 9.5L13.6 20"/>
    <path d="M7.5 9.3a2.3 2.3 0 011.2-4.2 2.6 2.6 0 015-1 2.4 2.4 0 013.2 2.3c.9.3 1.6 1.2 1.6 2.2 0 .3-.1.5-.2.7"/>`),

  /* בועות שיחה — אורח */
  guest: S(`
    <path d="M4 6.5h9a1.5 1.5 0 011.5 1.5v4A1.5 1.5 0 0113 13.5H9l-3 3v-3H4A1.5 1.5 0 012.5 12V8A1.5 1.5 0 014 6.5z" fill="currentColor" fill-opacity=".14"/>
    <path d="M17 10h3a1.5 1.5 0 011.5 1.5V15a1.5 1.5 0 01-1.5 1.5h-.5v2.5l-2.7-2.5H15"/>`),

  /* ענן ומנוחה — מנוחה */
  rest: S(`
    <path d="M7 17.5a3.5 3.5 0 01-.4-7A4.8 4.8 0 0116 8.7a3.6 3.6 0 011 7.1z" fill="currentColor" fill-opacity=".14"/>
    <path d="M14.5 3.5h3l-3 3h3" stroke-width="1.5"/>`),

  /* דגל סיום — סיכום ואיסוף */
  closing: S(`
    <path d="M6 21V4"/>
    <path d="M6 5c2-1.4 4-1.4 6 0s4 1.4 6 0v7c-2 1.4-4 1.4-6 0s-4-1.4-6 0z" fill="currentColor" fill-opacity=".16"/>`),

  /* חיצים — התארגנות ומעבר */
  transition: S(`
    <path d="M4.5 8h11l-2.5-2.5M19.5 16h-11L11 18.5"/>`),

  /* כוכב — פעילות כללית */
  activity: S(`
    <path d="M12 4l2.2 4.8 5.2.6-3.9 3.6 1 5.2L12 15.6l-4.5 2.6 1-5.2L4.6 9.4l5.2-.6z" fill="currentColor" fill-opacity=".16"/>`),
};

/* אווטארים לקבוצות — חיות ים, כל קבוצה והחיה שלה */
export const GROUP_AVATARS = {
  'יעל': S(`
    <path d="M12 4.2l1.9 4.1 4.5.5-3.3 3.1.9 4.4L12 14.1l-4 2.2.9-4.4-3.3-3.1 4.5-.5z" fill="currentColor" fill-opacity=".25"/>
    <circle cx="10.6" cy="9.6" r=".55" fill="currentColor" stroke="none"/>
    <circle cx="13.4" cy="9.6" r=".55" fill="currentColor" stroke="none"/>
    <path d="M10.8 11.6c.8.6 1.6.6 2.4 0"/>
    <path d="M4 20.3c1.6 0 2.4-1.2 4-1.2s2.4 1.2 4 1.2 2.4-1.2 4-1.2 2.4 1.2 4 1.2"/>`),
  'מיה': S(`
    <path d="M4.5 11.5c2-3.4 5-5.2 8.2-5.2 2.8 0 5.2 1.5 6.8 3.9.3.5.3 2-.1 2.6-1.6 2.4-4 3.9-6.7 3.9-3.2 0-6.2-1.8-8.2-5.2z" fill="currentColor" fill-opacity=".22"/>
    <path d="M4.5 11.5L2.2 8.8v5.4z" fill="currentColor" fill-opacity=".3"/>
    <circle cx="16.2" cy="10.6" r=".6" fill="currentColor" stroke="none"/>
    <path d="M12.5 6.5c-.8 1.6-.8 3.2 0 4.8M9.5 7.2c-.8 1.3-.8 2.8 0 4.1"/>
    <path d="M6 19.8c1.6 0 2.4-1.2 4-1.2s2.4 1.2 4 1.2 2.4-1.2 4-1.2"/>`),
  'גילבי': S(`
    <ellipse cx="12" cy="11" rx="5.4" ry="4.6" fill="currentColor" fill-opacity=".22"/>
    <path d="M12 6.4v9.2M8.2 8c2.4 1.8 5.2 1.8 7.6 0M8.2 14c2.4-1.8 5.2-1.8 7.6 0"/>
    <path d="M17.4 9.2c1.3-.2 2.3.2 3.1 1.1-.8.9-1.8 1.3-3.1 1.1"/>
    <circle cx="18.9" cy="7.6" r="1.5"/>
    <circle cx="19.2" cy="7.4" r=".45" fill="currentColor" stroke="none"/>
    <path d="M8.5 15.6l-1.3 2M15.5 15.6l1.3 2M12 15.9V18"/>`),
  'ריי': S(`
    <path d="M12 4.5c4.8 0 8.5 3.2 8.5 6.4 0 1.7-1.3 2.6-2.8 2.1l-2.4-.8c-.4 1.6-1.6 2.8-3.3 2.8s-2.9-1.2-3.3-2.8l-2.4.8c-1.5.5-2.8-.4-2.8-2.1C3.5 7.7 7.2 4.5 12 4.5z" fill="currentColor" fill-opacity=".22"/>
    <circle cx="10.3" cy="8.6" r=".55" fill="currentColor" stroke="none"/>
    <circle cx="13.7" cy="8.6" r=".55" fill="currentColor" stroke="none"/>
    <path d="M10.7 10.6c.9.6 1.7.6 2.6 0"/>
    <path d="M12 15v3.2c0 1.4.9 2.3 2.2 2.3"/>`),
};

/* דולפין — הלוגו של פליפר */
export const LOGO = (cls = '') => `
<svg class="${cls}" viewBox="0 0 64 64" fill="none" aria-hidden="true">
  <circle cx="32" cy="32" r="30" fill="url(#lg1)"/>
  <path d="M14 38c3.5-10 12-16.5 21.5-16.5 2.5-3 6-4.5 9.5-4.3-1.2 1.8-1.7 3.8-1.5 5.8 3 1.7 5.3 4.3 6.5 7.5-2.2-.6-4.4-.5-6.4.3C42 37.5 36.5 42 29.5 42c-2 2.6-4.8 4.3-8 4.8.9-1.9 1.2-3.9.9-5.9-3.2-.5-6.1-1.5-8.4-2.9z" fill="#fff"/>
  <circle cx="38.6" cy="27.8" r="1.6" fill="#0b4f74"/>
  <path d="M12 47c4 0 6-2.6 10-2.6s6 2.6 10 2.6 6-2.6 10-2.6 6 2.6 10 2.6" stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity=".85"/>
  <defs>
    <linearGradient id="lg1" x1="8" y1="8" x2="56" y2="56">
      <stop stop-color="#38bdf8"/><stop offset="1" stop-color="#0369a1"/>
    </linearGradient>
  </defs>
</svg>`;

export const CATEGORY_META = {
  opening:   { label: 'פתיחת יום',        color: '#eab308', soft: '#fef9c3' },
  swim:      { label: 'שיעור שחייה',      color: '#0284c7', soft: '#e0f2fe' },
  artistic:  { label: 'שחייה אומנותית',   color: '#8b5cf6', soft: '#ede9fe' },
  waterpolo: { label: 'כדור-מים',         color: '#4f46e5', soft: '#e0e7ff' },
  freeswim:  { label: 'מים חופשיים',      color: '#0891b2', soft: '#cffafe' },
  food:      { label: 'ארוחה והפסקה',     color: '#ea580c', soft: '#ffedd5' },
  games:     { label: 'משחקים וספורט',    color: '#16a34a', soft: '#dcfce7' },
  defense:   { label: 'הגנה עצמית',       color: '#dc2626', soft: '#fee2e2' },
  treasure:  { label: 'חפש את המטמון',    color: '#b45309', soft: '#fef3c7' },
  movie:     { label: 'סרט ופופקורן',     color: '#7c3aed', soft: '#f3e8ff' },
  guest:     { label: 'אורח מיוחד',       color: '#db2777', soft: '#fce7f3' },
  rest:      { label: 'מנוחה',            color: '#64748b', soft: '#f1f5f9' },
  closing:   { label: 'סיכום ואיסוף',     color: '#475569', soft: '#e2e8f0' },
  transition:{ label: 'התארגנות ומעבר',   color: '#94a3b8', soft: '#f1f5f9' },
  activity:  { label: 'פעילות',           color: '#0d9488', soft: '#ccfbf1' },
};

export const GROUP_COLORS = {
  'יעל':   { color: '#db2777', soft: '#fce7f3' },
  'מיה':   { color: '#d97706', soft: '#fef3c7' },
  'גילבי': { color: '#059669', soft: '#d1fae5' },
  'ריי':   { color: '#2563eb', soft: '#dbeafe' },
};

const FALLBACK_GROUP = { color: '#0891b2', soft: '#cffafe' };
export const groupColor = (name) => GROUP_COLORS[name] || FALLBACK_GROUP;
export const categoryMeta = (cat) => CATEGORY_META[cat] || CATEGORY_META.activity;
export const icon = (cat) => ICONS[cat] || ICONS.activity;
export const groupAvatar = (name) => GROUP_AVATARS[name] || ICONS.activity;
