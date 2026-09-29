import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { brokeredPreviewStorage } from "@/integrations/supabase/previewAuthStorage";

let recoveryClient: SupabaseClient<Database> | undefined;

export function getRecoveryAuthClient(): SupabaseClient<Database> {
  if (typeof window === "undefined") {
    throw new Error("Password recovery is only available in the browser.");
  }
  if (recoveryClient) return recoveryClient;

  recoveryClient = createClient<Database>(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        storage: brokeredPreviewStorage(),
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        flowType: "pkce",
      },
    },
  );
  return recoveryClient;
}