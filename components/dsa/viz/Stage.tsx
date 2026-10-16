import type { Bar, Cell, Frame, Mark, VizEdge, VizNode } from "@/lib/dsa/viz/types";

/** How narrow a cell may get, so long rows still fit before scrolling. */
function cellFloor(width: number) {
  if (width > 24) return "1.75rem";
  if (width > 16) return "2.1rem";
  return "2.6rem";
}

function CellBox({ cell }: { cell: Cell }) {
  return (
    <div className="vz-cell" data-tone={cell.tone ?? "idle"}>
      {cell.i !== undefined ? <span className="vz-cell-i">{cell.i}</span> : null}
      <span className="vz-cell-v">{cell.v}</span>
    </div>
  );
}

function Row({
  label,
  cells,
  marks,
}: {
  label?: string;
  cells: Cell[];
  marks?: Mark[];
}) {
  const width = cells.length;
  // A long row — a sieve of thirty numbers, say — cannot give every cell
  // 2.6rem and still fit. Shrink the floor rather than clipping, and let
  // .vz-row-wrap scroll if even that is not enough.
  const track = `repeat(${width}, minmax(${cellFloor(width)}, 1fr))`;
  return (
    <div className="vz-row-wrap">
      {label ? <p className="vz-row-label">{label}</p> : null}
      <div className="vz-row" data-tight={width > 16} style={{ gridTemplateColumns: track }}>
        {cells.map((cell, i) => (
          <CellBox cell={cell} key={i} />
        ))}
      </div>
      {marks?.length ? (
        <div
          className="vz-marks"
          style={{ gridTemplateColumns: track }}
        >
          {Array.from({ length: width }, (_, i) => {
            const here = marks.filter((m) => m.at === i);
            return (
              <div className="vz-mark-slot" key={i}>
                {here.map((m) => (
                  <span className="vz-mark" data-tone={m.tone ?? "active"} key={m.name}>
                    {m.name}
                  </span>
                ))}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function Grid({
  label,
  grid,
  rowNames,
  colNames,
}: {
  label?: string;
  grid: Cell[][];
  rowNames?: string[];
  colNames?: string[];
}) {
  const cols = grid[0]?.length ?? 0;
  const template = `${rowNames ? "auto " : ""}repeat(${cols}, minmax(2.1rem, 1fr))`;
  return (
    <div className="vz-row-wrap">
      {label ? <p className="vz-row-label">{label}</p> : null}
      <div className="vz-grid" style={{ gridTemplateColumns: template }}>
        {colNames ? (
          <>
            {rowNames ? <span className="vz-head" /> : null}
            {colNames.map((name, i) => (
              <span className="vz-head" key={`c${i}`}>
                {name}
              </span>
            ))}
          </>
        ) : null}
        {grid.map((line, r) => (
          <div className="vz-grid-line" key={r} style={{ display: "contents" }}>
            {rowNames ? <span className="vz-head">{rowNames[r]}</span> : null}
            {line.map((cell, c) => (
              <div className="vz-gcell" data-tone={cell.tone ?? "idle"} key={c}>
                {cell.v}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Bars({ bars, cap }: { bars: Bar[]; cap?: number }) {
  const top = cap ?? Math.max(1, ...bars.map((b) => b.v));
  return (
    <div className="vz-bars" style={{ gridTemplateColumns: `repeat(${bars.length}, 1fr)` }}>
      {bars.map((bar, i) => (
        <div className="vz-bar-slot" key={i}>
          <span className="vz-bar-v">{bar.label ?? bar.v}</span>
          <div
            className="vz-bar"
            data-tone={bar.tone ?? "idle"}
            style={{ height: `${Math.max(4, (bar.v / top) * 100)}%` }}
          />
        </div>
      ))}
    </div>
  );
}

function NodeMap({ nodes, edges }: { nodes: VizNode[]; edges?: VizEdge[] }) {
  const at = new Map(nodes.map((n) => [n.id, n]));
  const maxY = Math.max(100, ...nodes.map((n) => n.y + 12));
  return (
    <div className="vz-nodemap">
      <svg viewBox={`0 0 100 ${maxY}`} preserveAspectRatio="xMidYMid meet" role="img">
        <defs>
          <marker
            id="vz-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L10 5 L0 10 z" fill="currentColor" />
          </marker>
        </defs>

        {edges?.map((edge, i) => {
          const a = at.get(edge.from);
          const b = at.get(edge.to);
          if (!a || !b) return null;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const len = Math.hypot(dx, dy) || 1;
          const pad = 5.2;
          const x1 = a.x + (dx / len) * pad;
          const y1 = a.y + (dy / len) * pad;
          const x2 = b.x - (dx / len) * pad;
          const y2 = b.y - (dy / len) * pad;
          return (
            <g className="vz-edge" data-tone={edge.tone ?? "idle"} key={i}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                markerEnd={edge.arrow ? "url(#vz-arrow)" : undefined}
              />
              {edge.label ? (
                <text className="vz-edge-label" x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 1.6}>
                  {edge.label}
                </text>
              ) : null}
            </g>
          );
        })}

        {nodes.map((node) => (
          <g className="vz-node" data-tone={node.tone ?? "idle"} key={node.id}>
            <circle cx={node.x} cy={node.y} r="5" />
            <text x={node.x} y={node.y + 1.7}>
              {node.label}
            </text>
            {node.sub ? (
              <text className="vz-node-sub" x={node.x} y={node.y + 9.4}>
                {node.sub}
              </text>
            ) : null}
          </g>
        ))}
      </svg>
    </div>
  );
}

export function Stage({ frame }: { frame: Frame }) {
  return (
    <div className="vz-stage">
      {frame.nodes ? <NodeMap nodes={frame.nodes} edges={frame.edges} /> : null}
      {frame.bars ? <Bars bars={frame.bars} cap={frame.barCap} /> : null}
      {frame.row ? <Row label={frame.rowLabel} cells={frame.row} marks={frame.marks} /> : null}
      {frame.row2 ? <Row label={frame.row2Label} cells={frame.row2} /> : null}
      {frame.grid ? (
        <Grid
          label={frame.gridLabel}
          grid={frame.grid}
          rowNames={frame.gridRowNames}
          colNames={frame.gridColNames}
        />
      ) : null}
    </div>
  );
}
