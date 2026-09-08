import {
  getKnightMoves,
  getBishopMoves,
  getRookMoves,
  getQueenMoves,
  getKingMoves,
  getPawnMoves,
} from "@/context/actions/get-moves";
import { copyPosition } from "@/hooks/use-position";
import { MovesProps, PerformMoveProps, Position } from "@/lib/types";

const getRegularMoves = ({
  position,
  previousPosition,
  piece,
  rank,
  file,
}: MovesProps): string[] => {
  const type = piece?.[1];

  switch (type) {
    case "r":
      return getRookMoves({ position, piece, rank, file });
    case "n":
      return getKnightMoves({ position, rank, file });
    case "b":
      return getBishopMoves({ position, piece, rank, file });
    case "q":
      return getQueenMoves({ position, piece, rank, file });
    case "k":
      return getKingMoves({ position, piece, rank, file });
    case "p":
      return getPawnMoves({ position, previousPosition, piece, rank, file });
    default:
      return [];
  }
};

const performMove = ({
  position,
  piece,
  rank,
  file,
  square,
}: PerformMoveProps): Position => {
  const newPosition = copyPosition(position);

  const isPawn = piece.endsWith("p");
  const isDiagonalMove = file !== square.file;
  const isEnPassant =
    isPawn && isDiagonalMove && position[square.rank][square.file] === " ";

  if (isEnPassant) {
    newPosition[rank][square.file] =
      " " as (typeof newPosition)[number][number];
  }

  newPosition[rank][file] = " " as (typeof newPosition)[number][number];
  newPosition[square.rank][square.file] =
    piece as (typeof newPosition)[number][number];

  return newPosition;
};

const arbiter = { getRegularMoves, performMove };

export default arbiter;
