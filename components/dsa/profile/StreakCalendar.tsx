"use client";

import { useState } from "react";
import { buildCalendar, monthLabels, type DayCount } from "@/lib/dsa/progress/streak";

const DAY_NAMES = ["", "Mon", "", "Wed", "", "Fri", ""];

export function StreakCalendar({ rows }: { rows: DayCount[] }) {
  const [hover, setHover] = useState<string | null>(null);
  const grid = buildCalendar(rows);
  const months = monthLabels(grid);
  const flat = grid.flat();
  const shown = flat.find((c) => c.day === hover);

  return (
    <div className="cal">
      <div className="cal-scroll">
        <div className="cal-inner">
          <div className="cal-months" style={{ gridTemplateColumns: `repeat(${grid.length}, 0.85rem)` }}>
            {grid.map((_, i) => {
              const label = months.find((m) => m.at === i);
              return (
                <span key={i} className="cal-month">
                  {label && i < grid.length - 2 ? label.label : ""}
                </span>
              );
            })}
          </div>

          <div className="cal-body">
            <div className="cal-days">
              {DAY_NAMES.map((name, i) => (
                <span key={i}>{name}</span>
              ))}
            </div>

            <div className="cal-grid" style={{ gridTemplateColumns: `repeat(${grid.length}, 0.85rem)` }}>
              {grid.map((week, w) => (
                <div className="cal-week" key={w}>
                  {week.map((cell) => (
                    <button
                      type="button"
                      key={cell.day}
                      className="cal-cell"
                      data-level={cell.level}
                      data-filler={cell.filler}
                      aria-label={`${cell.day}: ${cell.solved} solved`}
                      onMouseEnter={() => setHover(cell.day)}
                      onFocus={() => setHover(cell.day)}
                      onMouseLeave={() => setHover(null)}
                      onBlur={() => setHover(null)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="cal-foot">
        <p className="cal-tip" aria-live="polite">
          {shown && !shown.filler
            ? shown.solved > 0
              ? `${shown.solved} practice board${shown.solved === 1 ? "" : "s"} passed on ${shown.day}`
              : shown.visits > 0
                ? `Opened a lesson on ${shown.day}, but no board passed`
                : `Nothing on ${shown.day}`
            : "Hover a square to see that day."}
        </p>

        <div className="cal-key">
          <span>less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <span className="cal-cell cal-cell-key" data-level={level} key={level} />
          ))}
          <span>more</span>
        </div>
      </div>
    </div>
  );
}
