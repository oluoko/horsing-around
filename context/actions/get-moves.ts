import { Position } from "@/lib/types";

interface MovesProps {
  position: Position;
  piece?: string;
  rank: number;
  file: number;
}

export const getRookMoves = ({
  position,
  piece,
  rank,
  file,
}: MovesProps): string[] => {
  const moves: string[] = [];
  const us = piece?.[0];
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
      if (us && position[x][y].startsWith(us)) break;

      moves.push(`${x},${y}`);
    }
  });

  return moves;
};

export const getKnightMoves = ({
  position,
  rank,
  file,
}: MovesProps): string[] => {
  const moves: string[] = [];
  const enemy = position[rank][file].startsWith("w") ? "b" : "w";

  const candidates = [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
  ];

  candidates.forEach(([dx, dy]) => {
    const x = rank + dx;
    const y = file + dy;
    const cell = position?.[x]?.[y];

    if (cell === " " || cell?.startsWith(enemy)) {
      moves.push(`${x},${y}`);
    }
  });

  return moves;
};

export const getBishopMoves = ({
  position,
  piece,
  rank,
  file,
}: MovesProps): string[] => {
  const moves: string[] = [];
  const us = piece?.[0];
  const enemy = us === "w" ? "b" : "w";

  const directions = [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
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
      if (us && position[x][y].startsWith(us)) break;

      moves.push(`${x},${y}`);
    }
  });

  return moves;
};

export const getQueenMoves = ({
  position,
  piece,
  rank,
  file,
}: MovesProps): string[] => {
  const moves = [
    ...getRookMoves({ position, piece, rank, file }),
    ...getBishopMoves({ position, piece, rank, file }),
  ];

  return moves;
};
