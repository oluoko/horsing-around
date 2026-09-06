import { MovesProps } from "@/lib/types";

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

export const getKingMoves = ({
  position,
  piece,
  rank,
  file,
}: MovesProps): string[] => {
  const moves: string[] = [];
  const us = piece?.[0];

  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  directions.forEach(([dx, dy]) => {
    const x = rank + dx;
    const y = file + dy;

    if (
      position?.[x]?.[y] !== undefined &&
      (!us || !position[x][y].startsWith(us))
    ) {
      moves.push(`${x},${y}`);
    }
  });

  return moves;
};

export const getPawnMoves = ({
  position,
  previousPosition,
  piece,
  rank,
  file,
}: MovesProps): string[] => {
  const moves: string[] = [];
  const us = piece?.[0];
  const enemy = us === "w" ? "b" : "w";
  const dir = piece === "wp" ? 1 : -1;
  const startRank = piece === "wp" ? 1 : 6;

  if (position?.[rank + dir]?.[file] === " ") {
    moves.push(`${rank + dir},${file}`);

    if (rank === startRank && position?.[rank + 2 * dir]?.[file] === " ") {
      moves.push(`${rank + 2 * dir},${file}`);
    }
  }

  [-1, 1].forEach((df) => {
    const cell = position?.[rank + dir]?.[file + df];
    if (cell?.startsWith(enemy)) {
      moves.push(`${rank + dir},${file + df}`);
    }
  });

  if (previousPosition) {
    [-1, 1].forEach((df) => {
      const neighborFile = file + df;

      if (position?.[rank]?.[neighborFile] !== `${enemy}p`) return;

      const enemyStartRank = rank + dir * 2;
      const jumpedFromStart =
        previousPosition?.[enemyStartRank]?.[neighborFile] === `${enemy}p`;
      const wasEmptyBefore = previousPosition?.[rank]?.[neighborFile] === " ";

      if (jumpedFromStart && wasEmptyBefore) {
        moves.push(`${rank + dir},${neighborFile}`);
      }
    });
  }

  return moves;
};
