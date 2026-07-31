/* config.js — חיבור ההודעות (Supabase, פרויקט flipper-camp-newsletter) */

export const SUPABASE = {
  url: 'https://joyerclvkexbutbalfxb.supabase.co',
  // המפתח הציבורי (publishable) של הפרויקט — בטוח לשיתוף, מיועד לקוד צד-לקוח.
  key: 'sb_publishable_ZNRIWrTQwMD0E0MCauim7g_dh6Brf6I',
};

export const hasSupabase = () => Boolean(SUPABASE.url && SUPABASE.key);
