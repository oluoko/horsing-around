"use client";

import { useBoardContext } from "@/context/board-context";
import { GameState } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function MovesList() {
  const { boardState } = useBoardContext() as {
    boardState: GameState;
  };

  const { movesList } = boardState;

  return (
    <div className="flex flex-row flex-nowrap md:flex-wrap content-start overflow-x-auto md:overflow-y-auto md:overflow-x-hidden text-[1.1em] ">
      {movesList.map((move, i) => {
        const isWhiteMove = i % 2 === 0;

        return (
          <div
            key={i}
            className={cn(
              "flex shrink-0 basis-auto md:basis-[35%] items-baseline gap-1 p-0.5 md:p-1 border-y min-w-24 md:min-w-[48%]",
              isWhiteMove
                ? "border-l border-r bg-white/20 ml-1"
                : "pl-2 border-r bg-black/35 mr-1",
            )}
            onClick={() => {
              console.log("Go back to this position", move);
            }}
          >
            {isWhiteMove && (
              <span className="opacity-50 mx-1">{Math.floor(i / 2) + 1}.</span>
            )}
            <span>{move}</span>
          </div>
        );
      })}
    </div>
  );
}
