"use client";

import { useBoardContext } from "@/context/board-context";
import { GameState } from "@/lib/types";

export default function MovesList() {
  const { boardState } = useBoardContext() as {
    boardState: GameState;
  };

  const { movesList } = boardState;

  return (
    <div className="flex flex-row flex-nowrap md:flex-wrap content-start overflow-x-auto md:overflow-y-auto md:overflow-x-hidden text-[1.1em] md:h-full">
      {movesList.map((move, i) => {
        const isWhiteMove = i % 2 === 0;

        return (
          <div
            key={i}
            className="flex shrink-0 basis-auto md:basis-[35%] items-baseline gap-1 pb-1 px-2 md:px-0"
          >
            {isWhiteMove && (
              <span className="text-xs opacity-50">
                {Math.floor(i / 2) + 1}.
              </span>
            )}
            <span>{move}</span>
          </div>
        );
      })}
    </div>
  );
}
