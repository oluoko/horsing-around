import { Position } from "@/lib/types";

export const getRookMoves = ({
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
  const moves: string[] = [];
  const us = piece[0];
  const enemy = us === "w" ? "b" : "w";

  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  directions.forEach(([dx, dy]) => {
    for (let i = 1; i < 8; i++) {
      const x = rank + i * dx;
      const y = file + i * dy;

      if (position?.[x]?.[y] === undefined) break;
      if (position[x][y].startsWith(enemy)) {
        moves.push(`${x},${y}`);
        break;
      }
      if (position[x][y].startsWith(us)) break;

      moves.push(`${x},${y}`);
    }
  });

  return moves;
};
