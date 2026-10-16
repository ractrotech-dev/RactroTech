import Link from "next/link";
import { redirect } from "next/navigation";
import { StreakCalendar } from "@/components/dsa/profile/StreakCalendar";
import { ChapterProgress } from "@/components/dsa/profile/ChapterProgress";
import { SetupCard } from "@/components/dsa/profile/SetupCard";
import { extractFullName } from "@/lib/auth/extract-auth-profile";
import { serverClient } from "@/lib/dsa/supabase/server";
import { SUPABASE_READY } from "@/lib/dsa/supabase/config";
import { LESSONS, TOTAL_SECTIONS, getLesson } from "@/lib/dsa/lessons/library";
import {
  activeDays,
  currentStreak,
  longestStreak,
  totalSolved,
  type DayCount,
} from "@/lib/dsa/progress/streak";
import { MIGRATION_HINT, isMissingSchema } from "@/lib/dsa/supabase/schema";
import type { ProgressRow, SubmissionRow } from "@/lib/dsa/supabase/types";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Your DSA progress",
  description: "Your learning progress, your streak, and everything you have solved.",
  noIndex: true,
});

// Progress is per-user and changes constantly, so never cache this page.
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  if (!SUPABASE_READY) {
    return (
      <main className="core lesson">
        <section className="hero-core lesson-hero">
          <p className="signal">Not configured</p>
          <h1>No backend yet</h1>
          <p className="lede">
            Progress needs the Supabase keys in <code>.env.local</code>. The lessons
            all work without them.
          </p>
        </section>
        <p className="next-row">
          <Link href="/dsa/learn/intro" className="back-map">
            Back to the syllabus
          </Link>
        </p>
      </main>
    );
  }

  const supabase = serverClient()!;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dsa/profile");

  // A Ractrotech account has no course row until its first visit here. Create it now so
  // the welcome redirect below and the setup card always have a row to work with.
  const ensured = await supabase
    .from("dsa_profiles")
    .upsert({ id: user.id }, { onConflict: "id", ignoreDuplicates: true });

  if (isMissingSchema(ensured.error)) {
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

  const [profileRes, progressRes, activityRes, recentRes] = await Promise.all([
    supabase.from("dsa_profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("dsa_progress").select("topic_id, section_id, solved_at").eq("user_id", user.id),
    supabase.from("dsa_activity").select("day, solved, visits").eq("user_id", user.id),
    supabase
      .from("dsa_submissions")
      .select("topic_id, section_id, passed, created_at")
      .eq("user_id", user.id)
      .eq("passed", true)
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const profile = profileRes.data;

  // First visit — ask the five questions before anything else.
  if (profile && !profile.onboarded_at) redirect("/dsa/welcome");

  const progress = (progressRes.data ?? []) as Pick<ProgressRow, "topic_id" | "section_id" | "solved_at">[];
  const activity = (activityRes.data ?? []) as DayCount[];
  const recent = (recentRes.data ?? []) as Pick<SubmissionRow, "topic_id" | "section_id" | "created_at">[];

  const done = new Map<string, Set<string>>();
  for (const row of progress) {
    if (!done.has(row.topic_id)) done.set(row.topic_id, new Set());
    done.get(row.topic_id)!.add(row.section_id);
  }

  const solvedSections = progress.length;
  const chaptersDone = LESSONS.filter(
    (lesson) => (done.get(lesson.id)?.size ?? 0) === lesson.sections.length,
  ).length;
  const streak = currentStreak(activity);
  const best = longestStreak(activity);
  const name = extractFullName(user) || user.email?.split("@")[0] || "learner";

  return (
    <main className="core lesson lesson-wide">
      <header className="hud">
        <p className="hud-rail">
          <span>Learn DSA</span>
          <span className="hud-dot" />
          <span>Your progress</span>
        </p>
      </header>

      <section className="hero-core lesson-hero">
        <p className="signal">{user.email}</p>
        <h1>{name}</h1>
        <p className="lede">
          {streak > 0
            ? `${streak} day${streak === 1 ? "" : "s"} in a row. Keep it alive — do one board today.`
            : "No streak running. One practice board today starts one."}
        </p>
      </section>

      <div className="stat-row">
        <div className="stat">
          <span className="stat-n">{streak}</span>
          <span className="stat-k">day streak</span>
        </div>
        <div className="stat">
          <span className="stat-n">{best}</span>
          <span className="stat-k">longest streak</span>
        </div>
        <div className="stat">
          <span className="stat-n">{solvedSections}</span>
          <span className="stat-k">of {TOTAL_SECTIONS} lessons solved</span>
        </div>
        <div className="stat">
          <span className="stat-n">{chaptersDone}</span>
          <span className="stat-k">of {LESSONS.length} chapters finished</span>
        </div>
        <div className="stat">
          <span className="stat-n">{activeDays(activity)}</span>
          <span className="stat-k">active days</span>
        </div>
        <div className="stat">
          <span className="stat-n">{totalSolved(activity)}</span>
          <span className="stat-k">boards passed</span>
        </div>
      </div>

      {profile ? <SetupCard profile={profile} /> : null}

      <article className="lesson-card">
        <p className="signal">Every day you showed up</p>
        <h2>Learning calendar</h2>
        <p>
          One square per day. A square fills in when you pass a practice board —
          the more you pass, the brighter it gets. Opening a lesson without
          solving anything shows faintly, but it does not keep a streak alive.
        </p>
        <StreakCalendar rows={activity} />
      </article>

      <article className="lesson-card">
        <p className="signal">Where you are</p>
        <h2>Chapter by chapter</h2>
        <p>
          Each bar is one chapter. It fills as you pass the practice board at the
          end of each lesson inside it.
        </p>
        <ChapterProgress done={done} />
      </article>

      {recent.length ? (
        <article className="lesson-card">
          <p className="signal">Latest</p>
          <h2>Recently solved</h2>
          <ul className="recent-list">
            {recent.map((row) => {
              const lesson = getLesson(row.topic_id);
              const section = lesson?.sections.find((s) => s.id === row.section_id);
              return (
                <li key={`${row.topic_id}-${row.section_id}-${row.created_at}`}>
                  <Link href={`/dsa/learn/topic/${row.topic_id}#${row.section_id}`}>
                    <strong>{section?.title ?? row.section_id}</strong>
                    <span>{lesson?.title ?? row.topic_id}</span>
                  </Link>
                  <time dateTime={row.created_at}>{row.created_at.slice(0, 10)}</time>
                </li>
              );
            })}
          </ul>
        </article>
      ) : (
        <article className="lesson-card">
          <p className="signal">Nothing yet</p>
          <h2>Start anywhere</h2>
          <p>
            Open a chapter, read the idea, step through the diagram, then write
            the code in the box at the end. The moment a board passes, it turns up
            here and fills today&apos;s square.
          </p>
          <p className="next-row">
            <Link href="/dsa/learn/topic/fundamentals" className="back-map">
              Start with Fundamentals
            </Link>
          </p>
        </article>
      )}
    </main>
  );
}
