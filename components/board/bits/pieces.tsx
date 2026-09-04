"use client";

import { cn } from "@/lib/utils";
import { copyPosition } from "@/hooks/use-position";
import { useRef, useState, type PointerEvent } from "react";
import { useBoardContext } from "@/context/board-context";
import {
  clearCandidates,
  generateCandidateMoves,
  makeNewMove,
} from "@/context/actions/move";
import { GameAction, GameState } from "@/lib/types";
import arbiter from "@/lib/arbiter";

interface DragState {
  rank: number;
  file: number;
  piece: string;
  x: number;
  y: number;
}

export default function Pieces() {
  const boardRef = useRef<HTMLDivElement>(null);

  const { boardState, dispatch } = useBoardContext() as {
    boardState: GameState;
    dispatch: (action: GameAction) => void;
  };

  const { turn } = boardState;

  const currentPosition = boardState.position[boardState.position.length - 1];
  const [drag, setDrag] = useState<DragState | null>(null);

  const getRelativeCoords = (clientX: number, clientY: number) => {
    const board = boardRef.current;
    if (!board) return null;

    const { left, top } = board.getBoundingClientRect();
    return { x: clientX - left, y: clientY - top };
  };

  const getSquare = (clientX: number, clientY: number) => {
    const board = boardRef.current;
    if (!board) return null;

    const { width, left, top } = board.getBoundingClientRect();
    const size = width / 8;

    const file = Math.floor((clientX - left) / size);
    const rank = 7 - Math.floor((clientY - top) / size);

    return { rank, file };
  };

  const startDrag = (
    e: PointerEvent<HTMLDivElement>,
    rank: number,
    file: number,
    piece: string,
  ) => {
    e.currentTarget.setPointerCapture(e.pointerId);

    const coords = getRelativeCoords(e.clientX, e.clientY);
    if (!coords) return;

    if (turn === piece[0]) {
      const candidateMoves = arbiter.getRegularMoves({
        position: currentPosition,
        piece,
        rank,
        file,
      });
      dispatch(generateCandidateMoves(candidateMoves));
    }

    setDrag({ rank, file, piece, x: coords.x, y: coords.y });
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag) return;

    const coords = getRelativeCoords(e.clientX, e.clientY);
    if (!coords) return;

    setDrag({ ...drag, x: coords.x, y: coords.y });
  };

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag) return;

    const square = getSquare(e.clientX, e.clientY);
    const { rank, file, piece } = drag;

    setDrag(null);

    if (!square) return;
    if (square.rank === rank && square.file === file) return;

    const newPosition = copyPosition(currentPosition);

    if (
      boardState.candidateMoves?.find(
        (n) => n === `${square.rank},${square.file}`,
      )
    ) {
      newPosition[rank][file] = "" as (typeof newPosition)[number][number];
      newPosition[square.rank][square.file] =
        piece as (typeof newPosition)[number][number];

      dispatch(makeNewMove(newPosition));
    }

    dispatch(clearCandidates());
  };

  return (
    <div
      ref={boardRef}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      className="pieces absolute left-0 right-0 top-0 bottom-0"
    >
      {currentPosition.map((r, rank) =>
        r.map((f, file) =>
          currentPosition[rank][file] ? (
            <Piece
              key={`${rank}-${file}`}
              rank={rank}
              file={file}
              piece={currentPosition[rank][file]}
              isDragging={drag?.rank === rank && drag?.file === file}
              dragX={drag?.x}
              dragY={drag?.y}
              onPointerDown={startDrag}
            />
          ) : null,
        ),
      )}
    </div>
  );
}

function Piece({
  rank,
  file,
  piece,
  isDragging,
  dragX,
  dragY,
  onPointerDown,
}: {
  rank: number;
  file: number;
  piece: string;
  isDragging: boolean;
  dragX?: number;
  dragY?: number;
  onPointerDown: (
    e: PointerEvent<HTMLDivElement>,
    rank: number,
    file: number,
    piece: string,
  ) => void;
}) {
  const col = file;
  const row = 7 - rank;

  const restStyle = {
    left: `${col * 12.5}%`,
    top: `${row * 12.5}%`,
  };

  const style =
    isDragging && dragX !== undefined && dragY !== undefined
      ? { left: dragX, top: dragY, transform: "translate(-50%, -50%)" }
      : restStyle;

  return (
    <div
      className={cn(
        "piece w-[12.5%] h-[12.5%] absolute bg-center bg-size-[90%] md:bg-size-[100%] bg-no-repeat touch-none",
        piece,
        isDragging ? "z-50 cursor-grabbing" : "cursor-grab",
      )}
      style={style}
      onPointerDown={(e) => onPointerDown(e, rank, file, piece)}
    />
  );
}
