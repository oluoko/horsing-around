"use client";

import { cn } from "@/lib/utils";
import { copyPosition, createPosition } from "@/hooks/use-position";
import { useState, useRef, type DragEvent } from "react";

export default function Pieces() {
  const ref = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState(createPosition());

  const calculateCoords = (e: DragEvent<HTMLDivElement>) => {
    const board = ref.current;

    if (!board) return;

    const { width, left, top } = board.getBoundingClientRect();
    const size = width / 8;

    const y = Math.floor((e.clientX - left) / size);
    const x = 7 - Math.floor((e.clientY - top) / size);

    return { x, y };
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    const newPosition = copyPosition(position);
    const coords = calculateCoords(e);

    if (!coords) return;

    const { x, y } = coords;

    const [piece, rankValue, fileValue] = e.dataTransfer
      .getData("text")
      .split(",");
    const rank = Number(rankValue);
    const file = Number(fileValue);

    newPosition[rank][file] = "" as (typeof newPosition)[number][number];
    newPosition[x][y] = piece as (typeof newPosition)[number][number];

    setPosition(newPosition);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault();

  return (
    <div
      ref={ref}
      onDrop={onDrop}
      onDragOver={onDragOver}
      className="pieces absolute left-0 right-0 top-0 bottom-0"
    >
      {position.map((r, rank) =>
        r.map((f, file) => (
          <div key={`${rank}-${file}`}>
            {position[rank][file] ? (
              <Piece
                key={`${rank}-${file}`}
                rank={rank}
                file={file}
                piece={position[rank][file]}
              />
            ) : null}
          </div>
        )),
      )}
    </div>
  );
}

export function Piece({
  rank,
  file,
  piece,
}: {
  rank: number;
  file: number;
  piece: string;
}) {
  const onDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `${piece}, ${rank},${file}`);

    setTimeout(() => {
      e.target.style.display = "none";
    }, 0);
  };

  const onDragEnd = (e: DragEvent<HTMLDivElement>) => {
    e.target.style.display = "block";
  };

  return (
    <div
      className={cn(
        "piece w-[12.5%] h-[12.5%] absolute bg-center bg-size-[90%] md:bg-size-[100%] bg-no-repeat",
        `${piece}`,
        `p-${file}${rank}`,
      )}
      draggable={true}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    />
  );
}
