"use client";

import { cn } from "@/lib/utils";
import { useRef, useState, type PointerEvent } from "react";
import { useBoardContext } from "@/context/board-context";
import {
  clearCandidates,
  generateCandidateMoves,
  makeNewMove,
  openPromotion,
  updateCastling,
  detectStalemate,
  detectCheckmate,
  insufficientMaterial,
} from "@/actions/game";
import { GameAction, GameState, Piece } from "@/lib/types";
import arbiter from "@/lib/arbiter";

interface DragState {
  rank: number;
  file: number;
  piece: Piece;
  x: number;
  y: number;
}

export default function Pieces() {
  const boardRef = useRef<HTMLDivElement>(null);

  const { boardState, dispatch } = useBoardContext() as {
    boardState: GameState;
    dispatch: (action: GameAction) => void;
  };

  const { turn, castlingDirections, position } = boardState;

  const currentPosition = position[position.length - 1];
  const previousPosition = position[position.length - 2];
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

  const updateCastlingState = ({
    rank,
    file,
    piece,
  }: {
    rank: number;
    file: number;
    piece: Piece;
  }) => {
    const direction = arbiter.getCastleDirections({
      castlingDirection: boardState.castlingDirections,
      piece,
      rank,
      file,
    });

    if (direction) {
      dispatch(updateCastling(direction));
    }
  };

  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag) return;

    const square = getSquare(e.clientX, e.clientY);
    const { rank, file, piece } = drag;

    setDrag(null);

    if (!square) return;
    if (square.rank === rank && square.file === file) return;

    const isValidMove = boardState.candidateMoves?.find(
      (n) => n === `${square.rank},${square.file}`,
    );

    if (isValidMove) {
      const castlingDirection =
        boardState.castlingDirections[`${piece.startsWith("b") ? "w" : "b"}`];
      if (
        (piece === "wp" && square.rank === 7) ||
        (piece === "bp" && square.rank === 0)
      ) {
        dispatch(openPromotion({ from: { rank, file }, to: square }));
        return;
      }

      if (piece.endsWith("r") || piece.endsWith("k")) {
        updateCastlingState({ rank, file, piece });
      }

      const newPosition = arbiter.performMove({
        position: currentPosition,
        piece,
        rank,
        file,
        square,
      });

      dispatch(makeNewMove(newPosition));

      if (
        arbiter.isStalemate({
          position: newPosition,
          player: turn === "w" ? "b" : "w",
          castlingDirection,
        })
      ) {
        dispatch(detectStalemate());
      }

      const isInMate = arbiter.isCheckmate({
        position: newPosition,
        player: turn === "w" ? "b" : "w",
        castlingDirection,
      });

      if (isInMate.checkmate) {
        dispatch(
          detectCheckmate({ whoIsInCheckmate: isInMate.whoIsInCheckmate }),
        );
      }

      const isMaterialInsufficient = arbiter.isMaterialInsufficient({
        position: newPosition,
      });

      if (isMaterialInsufficient) {
        dispatch(insufficientMaterial());
      }
    }

    dispatch(clearCandidates());
  };

  const startDrag = (
    e: PointerEvent<HTMLDivElement>,
    rank: number,
    file: number,
    piece: Piece,
  ) => {
    e.currentTarget.setPointerCapture(e.pointerId);

    const coords = getRelativeCoords(e.clientX, e.clientY);
    if (!coords) return;

    if (turn === piece[0]) {
      const candidateMoves = arbiter.getValidMoves({
        position: currentPosition,
        previousPosition,
        castlingDirections: castlingDirections[turn],
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
    move(e);
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
            <SinglePiece
              key={`${rank}-${file}`}
              rank={rank}
              file={file}
              piece={currentPosition[rank][file] as Piece}
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

function SinglePiece({
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
  piece: Piece;
  isDragging: boolean;
  dragX?: number;
  dragY?: number;
  onPointerDown: (
    e: PointerEvent<HTMLDivElement>,
    rank: number,
    file: number,
    piece: Piece,
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
