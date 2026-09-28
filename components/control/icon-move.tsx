import {
  FaChessBishop,
  FaChessKing,
  FaChessKnight,
  FaChessQueen,
  FaChessRook,
} from "react-icons/fa";

import { TbChessRookFilled } from "react-icons/tb";

const pieceIcons: Record<string, React.ComponentType<{ size?: number }>> = {
  K: FaChessKing,
  Q: FaChessQueen,
  R: TbChessRookFilled,
  B: FaChessBishop,
  N: FaChessKnight,
};

export default function IconMove({ move }: { move: string }) {
  if (move === "O-O" || move === "O-O-O") {
    return <span>{move}</span>;
  }

  const piece = move[0];
  const Icon = pieceIcons[piece];

  if (!Icon) {
    return <span>{move}</span>;
  }

  const rest = move.slice(1);

  return (
    <span className="inline-flex items-center">
      <Icon size={16} />
      {rest}
    </span>
  );
}
