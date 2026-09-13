import arbiter from "@/lib/arbiter";
import { MovesProps, Piece, Position, Turn, SquareCoords } from "@/lib/types";

export const getRookMoves = ({
  position,
  piece,
  rank,
  file,
}: MovesProps): string[] => {
  const moves: string[] = [];
  const us = piece?.[0];
  const player = us === "w" ? "b" : "w";

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
      if (position[x][y].startsWith(player)) {
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
  const player = position[rank][file].startsWith("w") ? "b" : "w";

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

    if (cell === " " || cell?.startsWith(player)) {
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
  const player = us === "w" ? "b" : "w";

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
      if (position[x][y].startsWith(player)) {
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
  const player = us === "w" ? "b" : "w";
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
    if (cell?.startsWith(player)) {
      moves.push(`${rank + dir},${file + df}`);
    }
  });

  if (previousPosition) {
    [-1, 1].forEach((df) => {
      const neighborFile = file + df;

      if (position?.[rank]?.[neighborFile] !== `${player}p`) return;

      const playerStartRank = rank + dir * 2;
      const jumpedFromStart =
        previousPosition?.[playerStartRank]?.[neighborFile] === `${player}p`;
      const wasEmptyBefore = previousPosition?.[rank]?.[neighborFile] === " ";

      if (jumpedFromStart && wasEmptyBefore) {
        moves.push(`${rank + dir},${neighborFile}`);
      }
    });
  }

  return moves;
};

export const getCastlingMoves = ({
  position,
  castlingDirections,
  piece,
  rank,
  file,
}: MovesProps): string[] => {
  const moves: string[] = [];

  if (file !== 4 || rank % 7 !== 0 || castlingDirections === "none") {
    return moves;
  }

  if (piece?.startsWith("w")) {
    if (arbiter.isPlayerInCheck({ positionAfterMove: position, player: "w" })) {
      return moves;
    }
    if (
      castlingDirections &&
      ["queen-side", "both"].includes(castlingDirections) &&
      position[0][3] === " " &&
      position[0][2] === " " &&
      position[0][1] === " " &&
      position[0][0] === "wr" &&
      !arbiter.isPlayerInCheck({
        positionAfterMove: arbiter.performMove({
          position,
          piece,
          rank,
          file,
          square: {
            rank: 0,
            file: 3,
          },
        }),
        player: "w",
      }) &&
      !arbiter.isPlayerInCheck({
        positionAfterMove: arbiter.performMove({
          position,
          piece,
          rank,
          file,
          square: {
            rank: 0,
            file: 2,
          },
        }),
        player: "w",
      })
    ) {
      moves.push("0,2");
    }
    if (
      castlingDirections &&
      ["king-side", "both"].includes(castlingDirections) &&
      position[0][5] === " " &&
      position[0][6] === " " &&
      position[0][7] === "wr" &&
      !arbiter.isPlayerInCheck({
        positionAfterMove: arbiter.performMove({
          position,
          piece,
          rank,
          file,
          square: {
            rank: 0,
            file: 5,
          },
        }),
        player: "w",
      }) &&
      !arbiter.isPlayerInCheck({
        positionAfterMove: arbiter.performMove({
          position,
          piece,
          rank,
          file,
          square: {
            rank: 0,
            file: 6,
          },
        }),
        player: "w",
      })
    ) {
      moves.push("0,6");
    }
  } else if (piece?.startsWith("b")) {
    if (arbiter.isPlayerInCheck({ positionAfterMove: position, player: "b" })) {
      return moves;
    }
    if (
      castlingDirections &&
      ["queen-side", "both"].includes(castlingDirections) &&
      position[7][3] === " " &&
      position[7][2] === " " &&
      position[7][1] === " " &&
      position[7][0] === "br" &&
      !arbiter.isPlayerInCheck({
        positionAfterMove: arbiter.performMove({
          position,
          piece,
          rank,
          file,
          square: {
            rank: 7,
            file: 3,
          },
        }),
        player: "b",
      }) &&
      !arbiter.isPlayerInCheck({
        positionAfterMove: arbiter.performMove({
          position,
          piece,
          rank,
          file,
          square: {
            rank: 7,
            file: 2,
          },
        }),
        player: "b",
      })
    ) {
      moves.push("7,2");
    }
    if (
      castlingDirections &&
      ["king-side", "both"].includes(castlingDirections) &&
      position[7][5] === " " &&
      position[7][6] === " " &&
      position[7][7] === "br" &&
      !arbiter.isPlayerInCheck({
        positionAfterMove: arbiter.performMove({
          position,
          piece,
          rank,
          file,
          square: {
            rank: 7,
            file: 5,
          },
        }),
        player: "b",
      }) &&
      !arbiter.isPlayerInCheck({
        positionAfterMove: arbiter.performMove({
          position,
          piece,
          rank,
          file,
          square: {
            rank: 7,
            file: 6,
          },
        }),
        player: "b",
      })
    ) {
      moves.push("7,6");
    }
  }

  return moves;
};

export const getKingPosition = ({
  position,
  player,
}: {
  position: Position;
  player: Turn;
}) => {
  let kingPos;
  position.forEach((rank, x) => {
    rank.forEach((file, y) => {
      if (position[x][y].startsWith(player) && position[x][y].endsWith("k"))
        kingPos = [x, y];
    });
  });

  return kingPos;
};

export const getPlayerPieces = ({
  position,
  player,
}: {
  position: Position;
  player: Turn;
}) => {
  const playerPieces: { piece: Piece; rank: number; file: number }[] = [];

  position.forEach((rank, x) => {
    rank.forEach((file, y) => {
      if (position[x][y].startsWith(player))
        playerPieces.push({
          piece: position[x][y] as Piece,
          rank: x,
          file: y,
        });
    });
  });

  return playerPieces;
};

export const areSameColorBishops = ({
  b1,
  b2,
}: {
  b1: SquareCoords;
  b2: SquareCoords;
}): boolean => {
  return (b1.rank + b2.file) % 2 === (b2.rank + b1.file) % 2;
};

export const findPieceCoords = ({
  position,
  piece,
}: {
  position: Position;
  piece: Piece;
}): SquareCoords[] => {
  const results: SquareCoords[] = [];

  position.forEach((rank, x) => {
    rank.forEach((file, y) => {
      if ((position[x][y] as Piece) === piece) {
        results.push({ rank: x, file: y });
      }
    });
  });

  return results;
};
