/* config.js — מחזורי הקייטנה וחיבור ההודעות */

export const SUPABASE = {
  url: 'https://joyerclvkexbutbalfxb.supabase.co',
  // המפתח הציבורי (publishable) של הפרויקט — בטוח לשיתוף, מיועד לקוד צד-לקוח.
  key: 'sb_publishable_ZNRIWrTQwMD0E0MCauim7g_dh6Brf6I',
};

export const hasSupabase = () => Boolean(SUPABASE.url && SUPABASE.key);

/* ---------- מחזורי הקייטנה ----------
 * כל מחזור והגיליון שלו. מחזור שהסתיים נשאר זמין כארכיון (?cycle=1),
 * והמחזור הנוכחי נבחר אוטומטית לפי התאריך. להוספת מחזור: שורה חדשה כאן.
 * tazman: מזהי הקורסים בטאזמן (ארוך/קצר) לסנכרון הנוכחות.
 */
export const CYCLES = [
  {
    id: 1,
    label: 'מחזור 1',
    sheetId: '1soicEw_7X2vz8ju3w3yOKLGMW0bmz6VznIb7MUGSpXI',
    start: '2026-08-02',
    end: '2026-08-06',
    tazman: { long: 120522, short: 121615 },
  },
  {
    id: 2,
    label: 'מחזור 2',
    sheetId: '1Nh8d0CFd93l8AuUce5uworYmuCKRONjsFNX1BIjQEGk',
    start: '2026-08-09',
    end: '2026-08-13',
    tazman: { long: 120523, short: 121614 },
  },
];

/** המחזור שרלוונטי לתאריך נתון: הראשון שעוד לא הסתיים, אחרת האחרון. */
export function cycleForDate(isoDate) {
  return CYCLES.find((c) => isoDate <= c.end) || CYCLES[CYCLES.length - 1];
}

/** המחזור להצגה: ?cycle=N גובר, אחרת לפי התאריך. */
export function activeCycle(isoDate) {
  const wanted = new URLSearchParams(location.search).get('cycle');
  if (wanted) {
    const hit = CYCLES.find((c) => String(c.id) === wanted.trim());
    if (hit) return hit;
  }
  return cycleForDate(isoDate);
}
