import {
  getKnightMoves,
  getBishopMoves,
  getRookMoves,
  getQueenMoves,
  getKingMoves,
  getPawnMoves,
} from "@/context/actions/get-moves";
import { MovesProps } from "@/lib/types";

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

const arbiter = { getRegularMoves };

export default arbiter;
