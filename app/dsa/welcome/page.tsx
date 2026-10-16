import { redirect } from "next/navigation";
import { Welcome } from "@/components/dsa/onboarding/Welcome";
import { extractFullName } from "@/lib/auth/extract-auth-profile";
import { serverClient } from "@/lib/dsa/supabase/server";
import { SUPABASE_READY } from "@/lib/dsa/supabase/config";
import { MIGRATION_HINT, isMissingSchema } from "@/lib/dsa/supabase/schema";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Five questions — Learn DSA",
  description: "A few questions so the course starts in the right place.",
  noIndex: true,
});

export const dynamic = "force-dynamic";

export default async function WelcomePage({
  searchParams,
}: {
  searchParams: { edit?: string };
}) {
  if (!SUPABASE_READY) redirect("/dsa/learn/intro");

  const supabase = serverClient()!;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dsa/welcome");

  const { data: profile, error } = await supabase
    .from("dsa_profiles")
    .select("onboarded_at")
    .eq("id", user.id)
    .maybeSingle();

  // The course tables have not been migrated yet — do not show questions that cannot
  // be saved. Say what is wrong instead.
  if (isMissingSchema(error)) {
    return (
      <main className="core lesson">
        <section className="hero-core lesson-hero">
          <p className="signal">Not ready</p>
          <h1>One migration behind</h1>
          <p className="lede">{MIGRATION_HINT}</p>
        </section>
      </main>
    );
  }

  // Answered already — unless they came here deliberately to change them.
  if (profile?.onboarded_at && searchParams.edit !== "1") redirect("/dsa/profile");

  const name = extractFullName(user)?.split(" ")[0] || user.email?.split("@")[0] || "there";

  return (
    <main className="core lesson">
      <section className="hero-core lesson-hero">
        <p className="signal">Before you start</p>
        <h1>Five questions</h1>
        <p className="lede">
          A minute, once. They decide which language the code is shown in and
          where we suggest you begin. Every answer can be changed later from your
          progress page.
        </p>
      </section>

      <Welcome userId={user.id} name={name} />
    </main>
  );
}
