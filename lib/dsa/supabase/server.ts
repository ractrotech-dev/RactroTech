import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { secureCookieOptions } from "@/lib/auth/cookies";
import { SUPABASE_KEY, SUPABASE_READY, SUPABASE_URL } from "@/lib/dsa/supabase/config";
import type { Database } from "@/lib/dsa/supabase/types";

/**
 * Server-side client typed for the course tables. Returns null when Supabase is not
 * configured. The session is the ordinary Ractrotech one — same cookies, same options as
 * utils/supabase/server.ts — so signing in anywhere on the site signs you in here.
 *
 * The setAll writes are wrapped in try/catch because cookies() is read-only inside a
 * Server Component; middleware.ts is what persists rotated tokens.
 */
export function serverClient() {
  if (!SUPABASE_READY) return null;
  const store = cookies();

  return createServerClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() {
        return store.getAll();
      },
      setAll(toSet) {
        try {
          for (const { name, value, options } of toSet) {
            store.set(name, value, secureCookieOptions(options as CookieOptions));
          }
        } catch {
          // Called from a Server Component — middleware refreshes the session.
        }
      },
    },
  });
}
