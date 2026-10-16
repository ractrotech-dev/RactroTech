"use client";

import { useEffect, useRef, useState } from "react";
import { Stage } from "@/components/dsa/viz/Stage";
import type { Viz } from "@/lib/dsa/viz/types";

const SPEEDS = [
  { label: "slow", ms: 1500 },
  { label: "1×", ms: 850 },
  { label: "fast", ms: 380 },
];

export function StepScope({ viz }: { viz: Viz }) {
  const [at, setAt] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const last = viz.frames.length - 1;
  const frame = viz.frames[Math.min(at, last)];
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playing) return;
    if (at >= last) {
      setPlaying(false);
      return;
    }
    const id = window.setTimeout(() => setAt((n) => n + 1), SPEEDS[speed].ms);
    return () => window.clearTimeout(id);
  }, [playing, at, last, speed]);

  const go = (n: number) => {
    setPlaying(false);
    setAt(Math.max(0, Math.min(last, n)));
  };

  const codeLines = viz.code ? viz.code.split("\n") : null;

  return (
    <section
      className="vz"
      aria-label={viz.title}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          go(at + 1);
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          go(at - 1);
        }
      }}
      tabIndex={0}
      ref={stageRef}
    >
      <header className="vz-top">
        <span className="vz-title">{viz.title}</span>
        <span className="vz-count">
          step {Math.min(at, last) + 1} / {viz.frames.length}
        </span>
      </header>

      <p className="vz-blurb">{viz.blurb}</p>

      <div className="vz-body" data-split={codeLines ? "true" : "false"}>
        {codeLines ? (
          <pre className="vz-code" aria-hidden="true">
            {codeLines.map((text, i) => (
              <span
                className="vz-code-line"
                data-hot={frame.line === i + 1}
                key={i}
              >
                <span className="vz-code-n">{i + 1}</span>
                {text || " "}
              </span>
            ))}
          </pre>
        ) : null}

        <Stage frame={frame} />
      </div>

      <p className="vz-say" aria-live="polite">
        {frame.say}
      </p>

      {frame.vars?.length ? (
        <div className="vz-vars">
          {frame.vars.map((pair) => (
            <span className="vz-var" key={pair.k}>
              <b>{pair.k}</b>
              {pair.v}
            </span>
          ))}
        </div>
      ) : null}

      {frame.out !== undefined ? (
        <p className="vz-out">
          <span>output</span>
          <code>{frame.out || " "}</code>
        </p>
      ) : null}

      <div className="vz-track" aria-hidden="true">
        <span
          className="vz-track-fill"
          style={{ width: `${((Math.min(at, last) + 1) / viz.frames.length) * 100}%` }}
        />
      </div>

      <div className="vz-controls">
        <button type="button" className="vz-btn" onClick={() => go(0)} aria-label="First step">
          |◀
        </button>
        <button type="button" className="vz-btn" onClick={() => go(at - 1)} aria-label="Previous step">
          ◀
        </button>
        <button
          type="button"
          className="vz-btn vz-btn-play"
          onClick={() => {
            if (at >= last) setAt(0);
            setPlaying((v) => !v);
          }}
        >
          {playing ? "❚❚ pause" : "▶ play"}
        </button>
        <button type="button" className="vz-btn" onClick={() => go(at + 1)} aria-label="Next step">
          ▶
        </button>
        <button type="button" className="vz-btn" onClick={() => go(last)} aria-label="Last step">
          ▶|
        </button>
        <button
          type="button"
          className="vz-btn vz-btn-speed"
          onClick={() => setSpeed((s) => (s + 1) % SPEEDS.length)}
        >
          {SPEEDS[speed].label}
        </button>
      </div>
    </section>
  );
}
