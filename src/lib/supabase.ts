import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Memeriksa apakah kredensial Supabase sudah terkonfigurasi dengan URL dan kunci yang valid.
 */
export function isSupabaseConfigured(): boolean {
  if (!supabaseUrl || !supabaseUrl.startsWith('https://')) {
    return false;
  }
  const hasKey = Boolean(supabaseServiceRoleKey || supabaseAnonKey);
  return hasKey;
}

export function isSupabaseAuthConfigured(): boolean {
  return Boolean(supabaseUrl?.startsWith('https://') && supabaseAnonKey);
}

let serverClientInstance: SupabaseClient | null = null;

/**
 * Mengambil client Supabase untuk operasi sisi server.
 * Memprioritaskan SUPABASE_SERVICE_ROLE_KEY untuk bypass RLS pada aksi admin pengurus,
 * atau fallback ke anon key jika service role belum disetel.
 */
export function getSupabaseServerClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (serverClientInstance) {
    return serverClientInstance;
  }

  const key = supabaseServiceRoleKey || supabaseAnonKey;
  if (!key) return null;

  serverClientInstance = createClient(supabaseUrl!, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return serverClientInstance;
}

let browserClientInstance: SupabaseClient | null = null;
let authClientInstance: SupabaseClient | null = null;

/** Client Auth sisi server yang memakai publishable/anon key, bukan service role. */
export function getSupabaseAuthClient(): SupabaseClient | null {
  if (!isSupabaseAuthConfigured()) return null;

  if (!authClientInstance) {
    authClientInstance = createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
  }

  return authClientInstance;
}

export function getSupabaseAdminClient(): SupabaseClient | null {
  if (!supabaseUrl?.startsWith('https://') || !supabaseServiceRoleKey) return null;
  return getSupabaseServerClient();
}

export async function inviteMemberByEmail(
  email: string,
  redirectTo: string
): Promise<{ sent: boolean; reason?: string }> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return { sent: false, reason: 'Supabase Admin belum dikonfigurasi.' };

  const { error } = await supabase.auth.admin.inviteUserByEmail(email, { redirectTo });
  if (error) {
    // User yang sudah menerima undangan tidak perlu dibuat ulang.
    if (error.message.toLowerCase().includes('already')) return { sent: false };
    return { sent: false, reason: 'Undangan email tidak dapat dikirim.' };
  }

  return { sent: true };
}

/**
 * Mengambil client Supabase untuk operasi sisi peramban (browser).
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (typeof window === 'undefined') {
    return getSupabaseServerClient();
  }

  if (!isSupabaseConfigured()) {
    return null;
  }

  if (browserClientInstance) {
    return browserClientInstance;
  }

  if (!supabaseAnonKey) return null;

  browserClientInstance = createClient(supabaseUrl!, supabaseAnonKey);
  return browserClientInstance;
}
