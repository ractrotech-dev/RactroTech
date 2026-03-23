import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

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
        // Check if user already exists in users_table
        const { data: existing, error: selectError } = await supabase
          .from("users_table")
          .select("id")
          .eq("id", user.id)
          .maybeSingle();

        if (!selectError && !existing) {
          // Insert with sane defaults; stripe_id required but can be a placeholder for now
          await supabase.from("users_table").insert({
            id: user.id,
            name: (user.user_metadata as any)?.full_name ?? user.email ?? "User",
            email: user.email,
            plan: "none",
            stripe_id: "none",
            role: "user",
          });
        }
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}