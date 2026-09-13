import type { SquareCoords } from "@/lib/types";

const squareCenter = ({ rank, file }: SquareCoords, flipped: boolean) => {
  const col = flipped ? 7 - file : file;
  const row = flipped ? rank : 7 - rank;
  return { x: (col + 0.5) * 12.5, y: (row + 0.5) * 12.5 };
};

export default function Arrows({
  arrows,
  preview,
  flipped,
}: {
  arrows: { from: SquareCoords; to: SquareCoords }[];
  preview: { from: SquareCoords; toPct: { x: number; y: number } } | null;
  flipped: boolean;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 size-full pointer-events-none z-40"
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="3"
          markerHeight="3"
          refX="1.5"
          refY="1.5"
          orient="auto"
        >
          <polygon points="0 0, 3 1.5, 0 3" fill="rgba(255,170,0,0.9)" />
        </marker>
      </defs>

      {arrows.map((arrow, i) => {
        const from = squareCenter(arrow.from, flipped);
        const to = squareCenter(arrow.to, flipped);
        return (
          <line
            key={i}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="rgba(255,170,0,0.9)"
            strokeWidth={1.5}
            markerEnd="url(#arrowhead)"
          />
        );
      })}

      {preview && (
        <line
          x1={squareCenter(preview.from, flipped).x}
          y1={squareCenter(preview.from, flipped).y}
          x2={preview.toPct.x}
          y2={preview.toPct.y}
          stroke="rgba(255,170,0,0.5)"
          strokeWidth={1.5}
          markerEnd="url(#arrowhead)"
        />
      )}
    </svg>
  );
}
