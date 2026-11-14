export const isSupabaseConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

/** Demo mode is limited to local development and never bypasses production authentication. */
export const isDemoMode = process.env.MAAK_DEMO_MODE === 'true' && process.env.NODE_ENV !== 'production';
