// A tiny frame format that every interactive diagram on the site speaks.
//
// A tracer runs a real algorithm and records one Frame per meaningful step.
// The player (components/viz/StepScope.tsx) knows nothing about algorithms —
// it just draws whatever a frame happens to carry. That keeps every diagram
// on the site consistent, and keeps the diagrams honest: they are produced by
// running the code, not by hand-drawing what we wish the code did.

export type Tone =
  | "idle"
  | "active"
  | "compare"
  | "window"
  | "done"
  | "good"
  | "bad"
  | "ghost";

/** One box in a row or a grid. */
export type Cell = {
  /** What is written inside the box. */
  v: string;
  /** Small caption above the box — usually the index. */
  i?: string;
  tone?: Tone;
};

/** A named arrow that sits under a row and points at one box. */
export type Mark = { at: number; name: string; tone?: Tone };

export type VizNode = {
  id: string;
  label: string;
  /** 0-100 across, 0-100 down. The player scales it. */
  x: number;
  y: number;
  tone?: Tone;
  sub?: string;
};

export type VizEdge = {
  from: string;
  to: string;
  tone?: Tone;
  label?: string;
  /** Draw an arrow head. Linked lists and directed graphs want this. */
  arrow?: boolean;
};

export type Bar = { v: number; tone?: Tone; label?: string };

export type Frame = {
  /** The one-line, plain-English story of this step. */
  say: string;
  /** 1-based line of `Viz.code` to light up. */
  line?: number;

  rowLabel?: string;
  row?: Cell[];
  row2Label?: string;
  row2?: Cell[];
  marks?: Mark[];

  gridLabel?: string;
  grid?: Cell[][];
  gridRowNames?: string[];
  gridColNames?: string[];

  nodes?: VizNode[];
  edges?: VizEdge[];

  bars?: Bar[];
  barCap?: number;

  /** The variable watch strip. */
  vars?: { k: string; v: string }[];
  /** Everything printed so far. */
  out?: string;
};

export type Viz = {
  title: string;
  /** One sentence: what to watch for while stepping. */
  blurb: string;
  code?: string;
  frames: Frame[];
};

/* ------------------------------------------------------------- helpers -- */

/** Build a row of boxes, with tones given per index. */
export function row(
  values: readonly (number | string)[],
  tones: Record<number, Tone> = {},
  opts: { index?: boolean } = {},
): Cell[] {
  const showIndex = opts.index !== false;
  return values.map((v, i) => ({
    v: String(v),
    i: showIndex ? String(i) : undefined,
    tone: tones[i] ?? "idle",
  }));
}

/** Tone every index in [from, to] the same way. */
export function span(from: number, to: number, tone: Tone): Record<number, Tone> {
  const out: Record<number, Tone> = {};
  for (let i = from; i <= to; i++) out[i] = tone;
  return out;
}

export function vars(pairs: Record<string, string | number>) {
  return Object.entries(pairs).map(([k, v]) => ({ k, v: String(v) }));
}
