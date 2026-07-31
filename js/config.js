/* config.js — חיבור ההודעות (Supabase, פרויקט flipper-camp-newsletter) */

export const SUPABASE = {
  url: 'https://joyerclvkexbutbalfxb.supabase.co',
  // המפתח הציבורי (anon / publishable) של הפרויקט. מדביקים פעם אחת ומקמטים.
  // בלי מפתח — הפס הרץ מציג הודעות ברירת מחדל וניהול ההודעות באדמין מושבת.
  key: '',
};

export const hasSupabase = () => Boolean(SUPABASE.url && SUPABASE.key);
