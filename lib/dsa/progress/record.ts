"use client";

import { browserClient } from "@/lib/dsa/supabase/client";
import { todayKey } from "@/lib/dsa/progress/streak";

export type SaveState = "off" | "anon" | "saving" | "saved" | "error";

/**
 * Records an attempt at a practice board.
 *
 * Returns what happened so the pad can say so honestly rather than pretending
 * to have saved. "off" means no backend, "anon" means not signed in.
 */
export async function recordSolve(input: {
  topicId: string;
  sectionId: string;
  code: string;
  passed: boolean;
}): Promise<SaveState> {
  const supabase = browserClient();
  if (!supabase) return "off";

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return "anon";

  const { error } = await supabase.rpc("dsa_record_solve", {
    p_topic_id: input.topicId,
    p_section_id: input.sectionId,
    p_code: input.code,
    p_passed: input.passed,
    p_day: todayKey(),
  });

  return error ? "error" : "saved";
}

/** Counts opening a lesson. Best effort — failures are silent on purpose. */
export async function recordVisit() {
  const supabase = browserClient();
  if (!supabase) return;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.rpc("dsa_record_visit", { p_day: todayKey() });
}
