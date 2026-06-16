import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { ensureAuthUserInDb } from "@/utils/auth-user-sync";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // We now have a session; ensure a row exists in public.users_table
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await ensureAuthUserInDb(user);
      }

      const provider =
        user?.app_metadata?.provider ??
        (Array.isArray(user?.app_metadata?.providers) ? user.app_metadata.providers[0] : null);

      let destination = next;
      if (provider === "google") {
        const url = new URL(next, origin);
        url.searchParams.set("auth", "google");
        destination = `${url.pathname}${url.search}`;
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${destination}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${destination}`);
      } else {
        return NextResponse.redirect(`${origin}${destination}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}