import type { LessonSection, TopicLesson } from "@/lib/dsa/lessons/types";

/** section id → the per-language code for that section. */
export type ChapterAlt = Record<string, NonNullable<LessonSection["alt"]>>;

/**
 * Layers translations onto a chapter.
 *
 * Kept separate from the English so the two can be reviewed independently, and
 * so an untranslated chapter is a missing key rather than a half-edited file.
 */
export function withAlt(lesson: TopicLesson, alts: ChapterAlt): TopicLesson {
  return {
    ...lesson,
    sections: lesson.sections.map((section) =>
      alts[section.id] ? { ...section, alt: alts[section.id] } : section,
    ),
  };
}
