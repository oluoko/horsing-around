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
import { GameAction, GameState, Piece, SquareCoords } from "@/lib/types";
import arbiter from "@/lib/arbiter";
import { getNewMoveNotation } from "@/actions/get-moves";

interface DragState {
  rank: number;
  file: number;
  piece: Piece;
  x: number;
  y: number;
}

export default function Pieces({ flipped }: { flipped: boolean }) {
  const boardRef = useRef<HTMLDivElement>(null);

  const { boardState, dispatch } = useBoardContext() as {
    boardState: GameState;
    dispatch: (action: GameAction) => void;
  };

  const { turn, castlingDirections, position } = boardState;
  const currentPosition = position[position.length - 1];
  const previousPosition = position[position.length - 2];
  const [drag, setDrag] = useState<DragState | null>(null);
  const [selected, setSelected] = useState<DragState | null>(null);

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

    const col = Math.floor((clientX - left) / size);
    const row = Math.floor((clientY - top) / size);

    const file = flipped ? 7 - col : col;
    const rank = flipped ? row : 7 - row;

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
      castlingDirection: castlingDirections,
      piece,
      rank,
      file,
    });

    if (direction) {
      dispatch(updateCastling(direction));
    }
  };

  const attemptMove = ({
    rank,
    file,
    piece,
    square,
  }: {
    rank: number;
    file: number;
    piece: Piece;
    square: SquareCoords;
  }) => {
    const isValidMove = boardState.candidateMoves?.find(
      (n) => n === `${square.rank},${square.file}`,
    );

    if (!isValidMove) {
      dispatch(clearCandidates());
      return;
    }

    const isTurn = boardState.turn === piece[0];

    if (!isTurn) {
      dispatch(clearCandidates());
      return;
    }

    if (!isTurn && isValidMove) {
      console.log("Premoving");
    }

    const castlingDirection =
      castlingDirections[piece.startsWith("w") ? "b" : "w"];

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

    const newMoveNotation = getNewMoveNotation({
      position: currentPosition,
      piece,
      rank,
      file,
      square,
    });

    dispatch(makeNewMove(newPosition, newMoveNotation));

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

    if (arbiter.isMaterialInsufficient({ position: newPosition })) {
      dispatch(insufficientMaterial());
    }

    dispatch(clearCandidates());
  };

  const selectPiece = (rank: number, file: number, piece: Piece) => {
    const candidateMoves = arbiter.getValidMoves({
      position: currentPosition,
      previousPosition,
      castlingDirections: castlingDirections[turn],
      piece,
      rank,
      file,
    });
    dispatch(generateCandidateMoves(candidateMoves));
    setSelected({ rank, file, piece, x: 0, y: 0 });
  };

  const deselect = () => {
    setSelected(null);
    dispatch(clearCandidates());
  };

  const startDrag = (
    e: PointerEvent<HTMLDivElement>,
    rank: number,
    file: number,
    piece: Piece,
  ) => {
    if (e.button !== 0) return;

    // A piece is already selected, and this square (which may well have
    // an enemy piece sitting on it) is one of its legal destinations —
    // this click is completing that move, not starting a new one.
    if (selected) {
      const isLegalTarget = boardState.candidateMoves?.find(
        (n) => n === `${rank},${file}`,
      );
      if (isLegalTarget) {
        attemptMove({
          rank: selected.rank,
          file: selected.file,
          piece: selected.piece,
          square: { rank, file },
        });
        setSelected(null);
        return;
      }
    }

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

  const onBoardPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button === 2) {
      const square = getSquare(e.clientX, e.clientY);
      const coords = getRelativeCoords(e.clientX, e.clientY);
      if (!square || !coords) return;

      const piece = currentPosition[square.rank]?.[square.file];
      if (!piece || piece === " ") {
        return;
      }

      const validSquares = arbiter.getValidMoves({
        position: currentPosition,
        previousPosition,
        castlingDirections: castlingDirections[piece[0] as "w" | "b"],
        piece,
        rank: square.rank,
        file: square.file,
      });

      return;
    }

    if (e.button !== 0) return;

    const target = e.target as HTMLElement;
    if (target.closest(".piece")) return;

    if (selected) {
      const square = getSquare(e.clientX, e.clientY);
      if (square) {
        attemptMove({
          rank: selected.rank,
          file: selected.file,
          piece: selected.piece,
          square,
        });
      }
      setSelected(null);
    }
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (drag) {
      const coords = getRelativeCoords(e.clientX, e.clientY);
      if (coords) setDrag({ ...drag, x: coords.x, y: coords.y });
    }

    // if (arrowDrag) {
    //   const coords = getRelativeCoords(e.clientX, e.clientY);
    //   if (coords) setArrowDrag({ ...arrowDrag, x: coords.x, y: coords.y });
    // }
  };

  // const finishArrow = (e: PointerEvent<HTMLDivElement>) => {
  //   if (!arrowDrag) return;

  //   const square = getSquare(e.clientX, e.clientY);
  //   const { rank, file, validSquares } = arrowDrag;
  //   setArrowDrag(null);

  //   if (!square) return;

  //   if (square.rank === rank && square.file === file) {
  //     setArrows([]);
  //     return;
  //   }

  //   const isLegalTarget = validSquares.includes(
  //     `${square.rank},${square.file}`,
  //   );
  //   if (!isLegalTarget) return;

  //   setArrows((prev) => {
  //     const matches = (a: { from: SquareCoords; to: SquareCoords }) =>
  //       a.from.rank === rank &&
  //       a.from.file === file &&
  //       a.to.rank === square.rank &&
  //       a.to.file === square.file;

  //     return prev.some(matches)
  //       ? prev.filter((a) => !matches(a))
  //       : [...prev, { from: { rank, file }, to: square }];
  //   });
  // };

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    // if (arrowDrag) {
    //   finishArrow(e);
    //   return;
    // }

    if (!drag) return;

    const square = getSquare(e.clientX, e.clientY);
    const { rank, file, piece } = drag;
    setDrag(null);

    if (!square) return;

    if (square.rank === rank && square.file === file) {
      if (selected && selected.rank === rank && selected.file === file) {
        deselect();
      } else {
        selectPiece(rank, file, piece);
      }
      return;
    }

    attemptMove({ rank, file, piece, square });
    setSelected(null);
  };

  return (
    <div
      ref={boardRef}
      onPointerDown={onBoardPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onContextMenu={(e) => e.preventDefault()}
      className="pieces absolute left-0 right-0 top-0 bottom-0"
    >
      {currentPosition.map((r, rank) =>
        r.map((f, file) =>
          currentPosition[rank][file] !== " " ? (
            <SinglePiece
              key={`${rank}-${file}`}
              rank={rank}
              file={file}
              piece={currentPosition[rank][file] as Piece}
              flipped={flipped}
              isDragging={drag?.rank === rank && drag?.file === file}
              isSelected={selected?.rank === rank && selected?.file === file}
              dragX={drag?.x}
              dragY={drag?.y}
              onPointerDown={startDrag}
            />
          ) : null,
        ),
      )}

      {/* <Arrows
        arrows={arrows}
        flipped={flipped}
        preview={
          arrowDrag
            ? {
                from: { rank: arrowDrag.rank, file: arrowDrag.file },
                toPct: {
                  x: (arrowDrag.x / (boardRef.current?.clientWidth || 1)) * 100,
                  y:
                    (arrowDrag.y / (boardRef.current?.clientHeight || 1)) * 100,
                },
              }
            : null
        }
      /> */}
    </div>
  );
}

export function SinglePiece({
  rank,
  file,
  piece,
  flipped,
  isDragging,
  isSelected,
  dragX,
  dragY,
  onPointerDown,
}: {
  rank: number;
  file: number;
  piece: Piece;
  flipped: boolean;
  isDragging: boolean;
  isSelected: boolean;
  dragX?: number;
  dragY?: number;
  onPointerDown: (
    e: PointerEvent<HTMLDivElement>,
    rank: number,
    file: number,
    piece: Piece,
  ) => void;
}) {
  const col = flipped ? 7 - file : file;
  const row = flipped ? rank : 7 - rank;

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
        isSelected && "ring-4 ring-yellow-400/70 rounded-full",
      )}
      style={style}
      onPointerDown={(e) => onPointerDown(e, rank, file, piece)}
    />
  );
}

export function PieceImage({ piece }: { piece: Piece }) {
  return (
    <div
      className={cn(
        "piece bg-center size-[100px] bg-size-[90%] md:bg-size-[100%] bg-no-repeat touch-none",
        piece,
      )}
    />
  );
}
