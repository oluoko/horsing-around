import {
  getKnightMoves,
  getBishopMoves,
  getRookMoves,
  getQueenMoves,
  getKingMoves,
  getPawnMoves,
  getCastlingMoves,
  getKingPosition,
  getPlayerPieces,
  areSameColorBishops,
  findPieceCoords,
} from "@/actions/get-moves";
import { copyPosition } from "@/hooks/use-position";
import {
  CastlingDirections,
  MovesProps,
  Piece,
  Position,
  Turn,
} from "@/lib/types";

const arbiter = {
  getPlayerColor({ piece }: { piece: string }): Turn {
    return piece.startsWith("w") ? "w" : "b";
  },

  getRegularMoves({
    position,
    previousPosition,
    piece,
    rank,
    file,
  }: MovesProps): string[] {
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
  },

  performMove({ position, piece, rank, file, square }: MovesProps): Position {
    const newPosition = copyPosition(position);

    if (!square || !piece) {
      return newPosition;
    }

    const isPawn = piece.endsWith("p");
    const isDiagonalMove = file !== square.file;
    const isEnPassant =
      isPawn && isDiagonalMove && position[square.rank][square.file] === " ";

    if (isEnPassant) {
      newPosition[rank][square.file] =
        " " as (typeof newPosition)[number][number];
    }

    if (piece.endsWith("k") && Math.abs(square.file - file) > 1) {
      if (square.file === 2) {
        newPosition[rank][0] = " " as (typeof newPosition)[number][number];
        newPosition[rank][3] = piece.startsWith("w") ? "wr" : "br";
      }
      if (square.file === 6) {
        newPosition[rank][7] = " " as (typeof newPosition)[number][number];
        newPosition[rank][5] = piece.startsWith("w") ? "wr" : "br";
      }
    }

    newPosition[rank][file] = " " as (typeof newPosition)[number][number];
    newPosition[square.rank][square.file] =
      piece as (typeof newPosition)[number][number];

    return newPosition;
  },

  getValidMoves({
    position,
    previousPosition,
    castlingDirections,
    piece,
    rank,
    file,
  }: MovesProps): string[] {
    if (!piece) return [];

    let moves = this.getRegularMoves({
      position,
      previousPosition,
      piece,
      rank,
      file,
    });

    if (piece.endsWith("k")) {
      moves = [
        ...moves,
        ...getCastlingMoves({
          position,
          castlingDirections,
          piece,
          rank,
          file,
        }),
      ];
    }

    const player = this.getPlayerColor({ piece });

    return moves.filter((move) => {
      const [toRank, toFile] = move.split(",").map(Number);

      const positionAfterMove = this.performMove({
        position,
        piece,
        rank,
        file,
        square: { rank: toRank, file: toFile },
      });

      return !this.isPlayerInCheck({ positionAfterMove, player });
    });
  },

  getCastleDirections({
    castlingDirection,
    rank,
    file,
    piece,
  }: {
    castlingDirection: { w: CastlingDirections; b: CastlingDirections };
    rank: number;
    file: number;
    piece: Piece;
  }): CastlingDirections {
    const color = this.getPlayerColor({ piece });
    const direction = castlingDirection[color];

    if (piece.endsWith("k")) return "none";

    if (file === 0 && rank === 0) {
      if (direction === "both") return "king-side";
      if (direction === "queen-side") return "none";
    }
    if (file === 7 && rank === 0) {
      if (direction === "both") return "queen-side";
      if (direction === "king-side") return "none";
    }
    if (file === 0 && rank === 7) {
      if (direction === "both") return "king-side";
      if (direction === "queen-side") return "none";
    }
    if (file === 7 && rank === 7) {
      if (direction === "both") return "queen-side";
      if (direction === "king-side") return "none";
    }

    return "both";
  },

  isPlayerInCheck({
    positionAfterMove,
    player,
  }: {
    positionAfterMove: Position;
    player: Turn;
  }): boolean {
    const enemy = player === "w" ? "b" : "w";
    const kingPosition = getKingPosition({
      position: positionAfterMove,
      player,
    });

    if (!kingPosition) return false;

    const enemyPieces = getPlayerPieces({
      position: positionAfterMove,
      player: enemy,
    });

    const enemyMoves = enemyPieces.reduce<string[]>(
      (acc, p) => [
        ...acc,
        ...this.getRegularMoves({ position: positionAfterMove, ...p }),
      ],
      [],
    );

    return enemyMoves.some((move) => {
      const [x, y] = move.split(",").map(Number);
      return kingPosition[0] === x && kingPosition[1] === y;
    });
  },

  isStalemate({
    position,
    player,
    castlingDirection,
  }: {
    position: Position;
    player: Turn;
    castlingDirection: CastlingDirections;
  }) {
    const isInCheck = this.isPlayerInCheck({
      positionAfterMove: position,
      player,
    });

    if (isInCheck) return false;

    const pieces = getPlayerPieces({ position, player });
    const moves = pieces.reduce<string[]>(
      (acc, p) => [
        ...acc,
        ...this.getValidMoves({
          position,
          castlingDirections: castlingDirection,
          ...p,
        }),
      ],
      [],
    );

    return moves.length === 0;
  },

  isMaterialInsufficient({ position }: { position: Position }): boolean {
    const pieces = position.flat().filter((cell) => cell !== " ");

    if (pieces.length === 2) {
      return true;
    }

    if (
      pieces.length === 3 &&
      pieces.some((p) => p.endsWith("b") || p.endsWith("n"))
    ) {
      return true;
    }

    if (pieces.length === 4) {
      const whiteBishop = findPieceCoords({ position, piece: "wb" })[0];
      const blackBishop = findPieceCoords({ position, piece: "bb" })[0];
      const bishops = pieces.filter((p) => p.endsWith("b"));
      const onlyKingsAndBishops = pieces.every(
        (p) => p.endsWith("k") || p.endsWith("b"),
      );

      if (
        onlyKingsAndBishops &&
        bishops.length === 2 &&
        whiteBishop &&
        blackBishop &&
        areSameColorBishops({ b1: whiteBishop, b2: blackBishop })
      ) {
        return true;
      }
    }

    return false;
  },

  isCheckmate({
    position,
    player,
    castlingDirection,
  }: {
    position: Position;
    player: Turn;
    castlingDirection: CastlingDirections;
  }): { whoIsInCheckmate: Turn | "none"; checkmate: boolean } {
    const isInCheck = this.isPlayerInCheck({
      positionAfterMove: position,
      player,
    });

    if (!isInCheck) {
      return {
        whoIsInCheckmate: "none",
        checkmate: false,
      };
    }

    const pieces = getPlayerPieces({ position, player });
    const moves = pieces.reduce<string[]>(
      (acc, p) => [
        ...acc,
        ...this.getValidMoves({
          position,
          castlingDirections: castlingDirection,
          ...p,
        }),
      ],
      [],
    );

    return {
      whoIsInCheckmate: player,
      checkmate: moves.length === 0,
    };
  },
};

export default arbiter;
