import { createClient } from "@supabase/supabase-js";

// Service-role client. Bypasses RLS. Use ONLY from server code that has already
// verified the actor (webhooks, internal redirects). Never expose to the client.
export function createSupabaseAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
