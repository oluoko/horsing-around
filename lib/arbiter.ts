import { getRookMoves } from "@/context/actions/get-moves";
import { Position } from "@/lib/types";

const getRegularMoves = ({
  position,
  piece,
  rank,
  file,
}: {
  position: Position;
  piece: string;
  rank: number;
  file: number;
}): string[] => {
  const type = piece[1];

  switch (type) {
    case "r":
      return getRookMoves({ position, piece, rank, file });
    default:
      return [];
  }
};

const arbiter = { getRegularMoves };

export default arbiter;
