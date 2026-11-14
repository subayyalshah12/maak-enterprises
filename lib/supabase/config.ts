export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/** Demo authentication is strictly limited to local Next.js development. */
export const isDemoMode =
  process.env.NODE_ENV === 'development' &&
  process.env.MAAK_DEMO_MODE === 'true';
