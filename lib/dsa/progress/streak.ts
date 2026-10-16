// Turning a list of active days into the things a profile page wants to show:
// a GitHub-style calendar, a current streak, and a longest streak.
//
// Everything here works in the *local* calendar day. A streak that resets at
// UTC midnight feels broken to someone studying at 10pm, so the day key is
// built from local date parts rather than from toISOString().

export type DayCount = { day: string; solved: number; visits: number };

export type CalendarCell = {
  /** YYYY-MM-DD */
  day: string;
  solved: number;
  visits: number;
  /** 0–4, the GitHub-style intensity. */
  level: 0 | 1 | 2 | 3 | 4;
  /** True for padding cells before the first real day. */
  filler: boolean;
};

export function dayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayKey(): string {
  return dayKey(new Date());
}

function addDays(date: Date, n: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + n);
  return copy;
}

function levelFor(solved: number, visits: number): CalendarCell["level"] {
  if (solved >= 8) return 4;
  if (solved >= 4) return 3;
  if (solved >= 2) return 2;
  if (solved >= 1) return 1;
  if (visits >= 1) return 1;
  return 0;
}

/**
 * A grid of weeks ending today, oldest week first. Each week is 7 cells
 * starting on Sunday, which is what makes the columns line up.
 */
export function buildCalendar(rows: DayCount[], weeks = 27, end = new Date()): CalendarCell[][] {
  const byDay = new Map(rows.map((r) => [r.day, r]));

  // Walk back to the Sunday that starts the first week we want to show.
  const lastDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  const endOfWeek = addDays(lastDay, 6 - lastDay.getDay());
  const start = addDays(endOfWeek, -(weeks * 7 - 1));

  const grid: CalendarCell[][] = [];
  for (let w = 0; w < weeks; w++) {
    const week: CalendarCell[] = [];
    for (let d = 0; d < 7; d++) {
      const date = addDays(start, w * 7 + d);
      const key = dayKey(date);
      const hit = byDay.get(key);
      week.push({
        day: key,
        solved: hit?.solved ?? 0,
        visits: hit?.visits ?? 0,
        level: hit ? levelFor(hit.solved, hit.visits) : 0,
        filler: date > lastDay,
      });
    }
    grid.push(week);
  }
  return grid;
}

/** Month labels aligned to the week column where each month first appears. */
export function monthLabels(grid: CalendarCell[][]): { at: number; label: string }[] {
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const out: { at: number; label: string }[] = [];
  let last = "";
  grid.forEach((week, i) => {
    const first = week[0];
    const month = names[Number(first.day.slice(5, 7)) - 1];
    if (month !== last) {
      out.push({ at: i, label: month });
      last = month;
    }
  });
  return out;
}

/**
 * The current streak counts back from today. Today not yet being done does not
 * break it — the streak is still alive until the day ends, which is what every
 * habit tracker does and what people expect.
 */
export function currentStreak(rows: DayCount[], end = new Date()): number {
  const active = new Set(rows.filter((r) => r.solved > 0).map((r) => r.day));
  const today = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  let cursor = active.has(dayKey(today)) ? today : addDays(today, -1);
  let streak = 0;
  while (active.has(dayKey(cursor))) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export function longestStreak(rows: DayCount[]): number {
  const days = rows
    .filter((r) => r.solved > 0)
    .map((r) => r.day)
    .sort();
  if (!days.length) return 0;

  let best = 1;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(`${days[i - 1]}T00:00:00`);
    const cur = new Date(`${days[i]}T00:00:00`);
    const gap = Math.round((cur.getTime() - prev.getTime()) / 86_400_000);
    run = gap === 1 ? run + 1 : 1;
    best = Math.max(best, run);
  }
  return best;
}

export function totalSolved(rows: DayCount[]): number {
  return rows.reduce((sum, r) => sum + r.solved, 0);
}

export function activeDays(rows: DayCount[]): number {
  return rows.filter((r) => r.solved > 0).length;
}
