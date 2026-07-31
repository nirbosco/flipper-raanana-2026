/* icons.js — אייקונים מצוירים לקייטנת פליפר. SVG בלבד, סגנון דו-גוני שמנמן. */

const S = (inner, vb = '0 0 24 24') =>
  `<svg viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;

const WAVE = `<path d="M3 19.5c1.7 0 2.5-1.4 4.2-1.4s2.5 1.4 4.2 1.4 2.5-1.4 4.2-1.4 2.5 1.4 4.2 1.4" stroke-width="2.2"/>`;

export const ICONS = {
  /* שמש קופצת מהמים — פתיחת יום */
  opening: S(`
    <circle cx="12" cy="9.5" r="4.4" fill="currentColor" fill-opacity=".28" stroke-width="2.2"/>
    <path d="M12 2.4v1.8M17.6 4.7l-1.3 1.3M20.6 10h-1.9M6.4 4.7l1.3 1.3M3.4 10h1.9" stroke-width="2.2"/>
    <path d="M8.6 9.1c.3-.5.8-.9 1.4-1" stroke-width="1.6" opacity=".8"/>
    ${WAVE}`),

  /* שחיין חותר עם התזה — שיעור שחייה */
  swim: S(`
    <circle cx="16.6" cy="6.4" r="2.5" fill="currentColor" fill-opacity=".28" stroke-width="2.2"/>
    <path d="M2.8 13.2l4.9-3.4a2.5 2.5 0 013.3.4l2.6 2.8" stroke-width="2.2"/>
    <path d="M8.6 10.3l4.5 1.4 4.8-1.1" stroke-width="2.2"/>
    <path d="M20.3 3.2l.9 2.1M21.9 6.9l-1.5.9" stroke-width="1.6" opacity=".7"/>
    ${WAVE}`),

  /* רגל מונפת וכוכב — שחייה אומנותית */
  artistic: S(`
    <path d="M9.6 16V8.4C9.6 6 11 4.4 12.9 4.4c1.6 0 2.7 1 2.9 2.5" stroke-width="2.2"/>
    <path d="M9.6 11c2.2-.2 4-1.3 5.2-3" stroke-width="2.2"/>
    <path d="M18.6 3.4l.6 1.7 1.7.6-1.7.6-.6 1.7-.6-1.7-1.7-.6 1.7-.6z" fill="currentColor" fill-opacity=".85" stroke-width="1.2"/>
    <path d="M4.6 5.6l.4 1.2 1.2.4-1.2.4-.4 1.2-.4-1.2-1.2-.4 1.2-.4z" fill="currentColor" fill-opacity=".5" stroke="none"/>
    ${WAVE}`),

  /* כדור על גל — כדור-מים */
  waterpolo: S(`
    <circle cx="12" cy="9.6" r="5.4" fill="currentColor" fill-opacity=".26" stroke-width="2.2"/>
    <path d="M12 4.2c-2.1 3.4-2.1 7.4 0 10.8M12 4.2c2.1 3.4 2.1 7.4 0 10.8M6.8 8.2c3.2 1.5 7.2 1.5 10.4 0M6.9 11.4c3.2-1.2 7-1.2 10.2 0" stroke-width="1.7"/>
    ${WAVE}`),

  /* טיפה גדולה ובועות — מים חופשיים */
  freeswim: S(`
    <path d="M11.2 3.6c-2.9 3.3-4.7 6-4.7 8.4a4.7 4.7 0 109.4 0c0-2.4-1.8-5.1-4.7-8.4z" fill="currentColor" fill-opacity=".28" stroke-width="2.2"/>
    <path d="M9.2 11.8c0 1.2.8 2.2 1.9 2.5" stroke-width="1.6" opacity=".85"/>
    <circle cx="19.2" cy="6.2" r="1.6" stroke-width="1.8"/>
    <circle cx="20.4" cy="11.2" r="1" fill="currentColor" stroke="none" fill-opacity=".6"/>
    ${WAVE}`),

  /* פלח אבטיח עם ביס — ארוחות והפסקות */
  food: S(`
    <path d="M3.6 11.5a8.4 8.4 0 0016.8 0z" fill="currentColor" fill-opacity=".28" stroke-width="2.2"/>
    <path d="M6 11.5a6 6 0 0012 0" stroke-width="1.7"/>
    <path d="M14.8 15.7a2.1 2.1 0 01.2 3" stroke-width="1.7"/>
    <circle cx="9.3" cy="14.2" r=".65" fill="currentColor" stroke="none"/>
    <circle cx="12" cy="15.4" r=".65" fill="currentColor" stroke="none"/>
    <circle cx="14" cy="13.6" r=".65" fill="currentColor" stroke="none"/>
    <path d="M12 11.5v8.2" stroke-width="2.2"/>`),

  /* כדור, קונוס ודגלון — משחקים וספורט */
  games: S(`
    <circle cx="8.4" cy="15.2" r="4.6" fill="currentColor" fill-opacity=".26" stroke-width="2.2"/>
    <path d="M8.4 10.6v9.2M4.4 13c2.4 1.7 5.6 1.7 8 0M4.4 17.4c2.4-1.7 5.6-1.7 8 0" stroke-width="1.7"/>
    <path d="M16.8 19.6V4.2l4.4 2.3-4.4 2.3" fill="currentColor" fill-opacity=".2" stroke-width="2.2"/>`),

  /* מגן עם ברק — הגנה עצמית */
  defense: S(`
    <path d="M12 3l6.8 2.5v5.4c0 4.5-2.9 8-6.8 9.8-3.9-1.8-6.8-5.3-6.8-9.8V5.5z" fill="currentColor" fill-opacity=".24" stroke-width="2.2"/>
    <path d="M12.9 7.6l-2.6 4h3.2l-2.6 4" stroke-width="1.9"/>`),

  /* מפה עם מסלול ו-X — חפש את המטמון */
  treasure: S(`
    <path d="M3.6 6.2l5.2-2.1 6.4 2.1 5.2-2.1v13.7l-5.2 2.1-6.4-2.1-5.2 2.1z" fill="currentColor" fill-opacity=".2" stroke-width="2.2"/>
    <path d="M8.8 4.1v13.7M15.2 6.2v13.7" stroke-width="1.6" opacity=".55"/>
    <path d="M5.8 13.5c1.6-.6 2.4-2.4 4.2-2.2 1.6.2 2 1.6 3.6 1.4" stroke-width="1.5" stroke-dasharray="1.5 2.1"/>
    <path d="M16.5 9.3l2.6 2.6M19.1 9.3l-2.6 2.6" stroke-width="2"/>`),

  /* דלי פופקורן — סרט */
  movie: S(`
    <path d="M6.2 9.8L7.8 20h8.4l1.6-10.2" fill="currentColor" fill-opacity=".22" stroke-width="2.2"/>
    <path d="M5.6 9.8h12.8" stroke-width="2.2"/>
    <path d="M9.8 9.8l.6 10.2M14.2 9.8l-.6 10.2" stroke-width="1.6" opacity=".6"/>
    <circle cx="8.6" cy="7" r="2.1" fill="currentColor" fill-opacity=".4" stroke-width="1.8"/>
    <circle cx="12.4" cy="5.8" r="2.4" fill="currentColor" fill-opacity=".4" stroke-width="1.8"/>
    <circle cx="15.9" cy="7.2" r="2" fill="currentColor" fill-opacity=".4" stroke-width="1.8"/>`),

  /* מגפון — אורח מיוחד */
  guest: S(`
    <path d="M4 10.2v3.6l2.8.5 8.4 4V5.7l-8.4 4z" fill="currentColor" fill-opacity=".24" stroke-width="2.2"/>
    <path d="M7.4 14.6l.9 4.2h2.4l-.7-3.7" stroke-width="1.9"/>
    <path d="M18.4 9.2a4 4 0 010 5.6M20.6 7a7.2 7.2 0 010 10" stroke-width="1.8" opacity=".8"/>`),

  /* ענן עם נשימה — מנוחה */
  rest: S(`
    <path d="M7 17.5a3.6 3.6 0 01-.4-7.2A5 5 0 0116.2 8.6a3.7 3.7 0 011 7.3z" fill="currentColor" fill-opacity=".22" stroke-width="2.2"/>
    <path d="M13.9 3.2h2.8l-2.8 2.8h2.8" stroke-width="1.7"/>
    <path d="M18.9 6.4h1.9l-1.9 1.9h1.9" stroke-width="1.4" opacity=".7"/>`),

  /* דגל מסיים מתנופף — סיכום ואיסוף */
  closing: S(`
    <path d="M5.6 21V3.4" stroke-width="2.4"/>
    <path d="M5.6 4.4c2.2-1.5 4.4-1.5 6.6 0s4.4 1.5 6.6 0v7.8c-2.2 1.5-4.4 1.5-6.6 0s-4.4-1.5-6.6 0z" fill="currentColor" fill-opacity=".24" stroke-width="2.2"/>
    <path d="M8.9 5.1v7.8M12.2 6.2V14M15.5 6.2v7.7" stroke-width="1.4" opacity=".45"/>`),

  /* עקבות מתקדמות — התארגנות ומעבר */
  transition: S(`
    <ellipse cx="7.2" cy="15.8" rx="2.1" ry="2.9" fill="currentColor" fill-opacity=".3" stroke-width="1.9" transform="rotate(-14 7.2 15.8)"/>
    <path d="M6 11.4l-.3-1.3M8.3 11.2l.2-1.3" stroke-width="1.7"/>
    <ellipse cx="15.6" cy="9.3" rx="2.1" ry="2.9" fill="currentColor" fill-opacity=".3" stroke-width="1.9" transform="rotate(12 15.6 9.3)"/>
    <path d="M14.6 5l-.1-1.3M16.9 5.2l.4-1.3" stroke-width="1.7"/>
    <path d="M18.4 16.6c1.5 0 2.7 1.2 2.7 2.7" stroke-width="1.6" opacity=".6"/>`),

  /* כוכב — פעילות כללית */
  activity: S(`
    <path d="M12 3.6l2.5 5.1 5.6.8-4 4 .9 5.6-5-2.7-5 2.7.9-5.6-4-4 5.6-.8z" fill="currentColor" fill-opacity=".26" stroke-width="2.2"/>`),
};

/* אווטארים לקבוצות — חיות ים לפי מיקום העמודה בגיליון, יציבים גם כשמשנים שם */
const AVATARS = [
  /* כוכב ים מחייך */
  S(`
    <path d="M12 3.4l2.3 4.6 5.1.6-3.7 3.5 1 5-4.7-2.5-4.7 2.5 1-5-3.7-3.5 5.1-.6z" fill="currentColor" fill-opacity=".3" stroke-width="2.2"/>
    <circle cx="10.4" cy="10.3" r=".7" fill="currentColor" stroke="none"/>
    <circle cx="13.6" cy="10.3" r=".7" fill="currentColor" stroke="none"/>
    <path d="M10.5 12.4c.9.8 2.1.8 3 0" stroke-width="1.7"/>
    ${WAVE}`),
  /* דג שמח */
  S(`
    <path d="M4.8 10.8c2-3.2 4.9-5 8-5 2.7 0 5.1 1.4 6.7 3.7.4.6.4 2 0 2.6-1.6 2.3-4 3.7-6.7 3.7-3.1 0-6-1.8-8-5z" fill="currentColor" fill-opacity=".28" stroke-width="2.2"/>
    <path d="M4.8 10.8L2.4 8.2v5.2z" fill="currentColor" fill-opacity=".45" stroke-width="2"/>
    <circle cx="16" cy="9.8" r=".75" fill="currentColor" stroke="none"/>
    <path d="M12.2 6.2c-.9 1.5-.9 3 0 4.5" stroke-width="1.5" opacity=".6"/>
    <path d="M14.9 12.1c.7.5 1.5.5 2.2.1" stroke-width="1.5"/>
    ${WAVE}`),
  /* צב ים */
  S(`
    <ellipse cx="11.4" cy="10.6" rx="5.6" ry="4.8" fill="currentColor" fill-opacity=".28" stroke-width="2.2"/>
    <path d="M8.7 7.2l1.2 2.3h3l1.2-2.3M9.9 9.5l-1.6 2.6M14.1 9.5l1.6 2.6M9.9 9.5h4.2l-1 3h-2.2z" stroke-width="1.4" opacity=".7"/>
    <circle cx="19.3" cy="8.3" r="1.9" fill="currentColor" fill-opacity=".3" stroke-width="2"/>
    <circle cx="19.9" cy="8" r=".55" fill="currentColor" stroke="none"/>
    <path d="M7.2 14.6l-1.4 1.8M15.6 14.6l1.4 1.8" stroke-width="2"/>
    ${WAVE}`),
  /* טרומיגון (סטינגריי) */
  S(`
    <path d="M12 4.6c4.7 0 8.3 2.9 8.3 5.8 0 1.6-1.3 2.4-2.7 1.9l-2.2-.7c-.4 1.5-1.6 2.6-3.4 2.6s-3-1.1-3.4-2.6l-2.2.7c-1.4.5-2.7-.3-2.7-1.9 0-2.9 3.6-5.8 8.3-5.8z" fill="currentColor" fill-opacity=".28" stroke-width="2.2"/>
    <circle cx="10.3" cy="8.5" r=".7" fill="currentColor" stroke="none"/>
    <circle cx="13.7" cy="8.5" r=".7" fill="currentColor" stroke="none"/>
    <path d="M10.6 10.4c.9.7 1.9.7 2.8 0" stroke-width="1.7"/>
    <path d="M12 14.2v2.6c0 1.6 1 2.6 2.4 2.7" stroke-width="2"/>
    ${WAVE}`),
];

/* הלוגו של פליפר — סמל הזנב. צבע דרך currentColor (כחול מותג / לבן על כהה) */
export const LOGO = (cls = '') => `
<svg class="${cls}" viewBox="0 0 234 234" fill="none" aria-hidden="true">
  <path fill="currentColor" d="M125.878 92.6747C136.186 60.768 126.268 41.8987 115.791 33.3842C115.791 33.3842 98.2301 54.962 91.4058 64.1115C85.8165 71.5763 81.9429 80.6092 79.9801 89.1108C71.3491 90.4845 62.991 93.7892 54.8019 98.2603C46.2229 102.926 22.1495 120.162 22.1495 120.162C32.3144 133.238 57.0117 141.546 85.9595 132.357C91.9128 129.999 98.659 127.821 105.041 127.264C110.735 126.746 114.816 128.34 118.846 132.292C125.111 138.448 138.513 153.87 159.557 167.685C177.3 179.323 193.419 185.505 211.772 186.49C190.403 215.312 156.074 234 117.364 234C105.444 234 93.9276 232.225 83.0868 228.92C81.371 228.388 79.6682 227.831 78.0173 227.248H78.0043C77.2114 226.963 76.4315 226.665 75.6386 226.38C75.3656 226.276 75.0927 226.172 74.8327 226.069C69.2303 223.879 63.8099 221.287 58.6625 218.306C39.6326 207.329 23.9953 191.168 13.6615 171.768C13.6225 171.716 13.5965 171.664 13.5705 171.612C12.2706 169.163 11.0488 166.674 9.91791 164.108C9.90491 164.044 9.8529 163.953 9.82691 163.888C9.61893 163.46 9.44994 163.033 9.25497 162.592C3.30163 148.596 0 133.174 0 117C0 52.383 52.5402 0 117.351 0C177.807 0 227.579 45.5662 234 104.131C217.973 123.895 186.724 127.29 163.041 126.785C152.083 126.551 141.112 125.346 130.597 122.223C116.363 118.011 122.524 103.029 125.852 92.7136L125.878 92.6747Z"/>
</svg>`;

/* פלטת קטגוריות — גוני בריכה וקיץ, מגובשת ורגועה */
export const CATEGORY_META = {
  opening:   { label: 'פתיחת יום',        color: '#c9871f', soft: '#faf1dc' },
  swim:      { label: 'שיעור שחייה',      color: '#2b7bb9', soft: '#e4eff8' },
  artistic:  { label: 'שחייה אומנותית',   color: '#8168c4', soft: '#eeeaf8' },
  waterpolo: { label: 'כדור-מים',         color: '#128a84', soft: '#def1ef' },
  freeswim:  { label: 'מים חופשיים',      color: '#3aa6c4', soft: '#e3f4f8' },
  food:      { label: 'ארוחה והפסקה',     color: '#cd7028', soft: '#f9ecdf' },
  games:     { label: 'משחקים וספורט',    color: '#4e9e52', soft: '#e7f3e6' },
  defense:   { label: 'הגנה עצמית',       color: '#c05b52', soft: '#f8e9e6' },
  treasure:  { label: 'חפש את המטמון',    color: '#aa7c33', soft: '#f6eedb' },
  movie:     { label: 'סרט ופופקורן',     color: '#9159ae', soft: '#f2e9f7' },
  guest:     { label: 'אורח מיוחד',       color: '#c25c8c', soft: '#f8e9f0' },
  rest:      { label: 'מנוחה',            color: '#7c8b99', soft: '#eef1f4' },
  closing:   { label: 'סיכום ואיסוף',     color: '#5e7285', soft: '#e9eef2' },
  transition:{ label: 'התארגנות ומעבר',   color: '#8ca0b0', soft: '#f0f4f6' },
  activity:  { label: 'פעילות',           color: '#2e9c8e', soft: '#e1f2ef' },
};

/* צבעי קבוצות לפי מיקום עמודה */
const GROUP_STYLES = [
  { color: '#c64a6d', soft: '#f9e7ec' },
  { color: '#bc7f1d', soft: '#f8efda' },
  { color: '#359062', soft: '#e2f2e9' },
  { color: '#3d6fbe', soft: '#e5edf9' },
];

export const groupStyle = (index) => GROUP_STYLES[((index % GROUP_STYLES.length) + GROUP_STYLES.length) % GROUP_STYLES.length];
export const groupAvatar = (index) => AVATARS[((index % AVATARS.length) + AVATARS.length) % AVATARS.length];
export const categoryMeta = (cat) => CATEGORY_META[cat] || CATEGORY_META.activity;
export const icon = (cat) => ICONS[cat] || ICONS.activity;
