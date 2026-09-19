"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { getCharacter } from "@/lib/utils";
import Square from "@/components/board/bits/square";
import Pieces from "@/components/board/bits/pieces";
import { Button } from "@/components/ui/button";
import { ArrowDownUp, Flag, Undo } from "lucide-react";
import { GameAction, GameState } from "@/lib/types";
import { useBoardContext } from "@/context/board-context";
import Popup from "@/components/popup";
import arbiter from "@/lib/arbiter";
import { getKingPosition } from "@/actions/get-moves";
import { resign, takeBack } from "@/actions/game";

export default function Board() {
  const ranks = Array.from({ length: 8 }, (_, i) => 8 - i);
  const files = Array.from({ length: 8 }, (_, i) => i + 1);

  const { boardState, dispatch } = useBoardContext() as {
    boardState: GameState;
    dispatch: (action: GameAction) => void;
  };
  const position = boardState.position[boardState.position.length - 1];

  const isChecked = (() => {
    const isInCheck = arbiter.isPlayerInCheck({
      positionAfterMove: position,
      player: boardState.turn,
    });

    if (isInCheck)
      return getKingPosition({ position, player: boardState.turn });

    return null;
  })();

  const isDarkSquare = (rank: number, file: number): boolean => {
    return (rank + file) % 2 === 0;
  };

  const getClassName = (i: number, j: number) => {
    let className = "square";

    if (boardState.candidateMoves?.find((n) => n === `${i},${j}`)) {
      if (position[i][j] !== " ") {
        className += " attacking";
      } else {
        className += " highlight";
      }
    }

    if (isChecked && isChecked[0] === i && isChecked[1] === j) {
      className += " checked";
    }

    return className;
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-center w-full md:w-min">
      <div className="relative size-[95vw] md:size-[95vh] p-1 bg-red-950/70">
        <AspectRatio ratio={1}>
          <div className="grid grid-cols-8 grid-rows-8 size-full">
            {ranks.map((rank) =>
              files.map((file) => (
                <Square
                  key={`${file}-${rank}`}
                  isDark={isDarkSquare(rank, file)}
                  rankLabel={file === 1 ? rank : undefined}
                  className={getClassName(rank - 1, file - 1)}
                  fileLabel={rank === 1 ? getCharacter(file) : undefined}
                />
              )),
            )}
          </div>

          <Pieces />
          <Popup />
        </AspectRatio>
      </div>
      <div className="flex md:grid gap-2 w-min">
        <Button variant="outline" onClick={() => {}}>
          <ArrowDownUp />
        </Button>

        <Button
          variant="destructive"
          onClick={() => {
            dispatch(resign(boardState.turn));
          }}
        >
          <Flag />
        </Button>
        <Button
          onClick={() => {
            dispatch(takeBack());
          }}
        >
          <Undo />
        </Button>
      </div>
    </div>
  );
}
