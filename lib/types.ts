export type Piece =
  | "wp"
  | "bp"
  | "wr"
  | "br"
  | "wn"
  | "bn"
  | "wb"
  | "bb"
  | "wq"
  | "bq"
  | "wk"
  | "bk";

export type Square = Piece | " ";

export type Position = Square[][];

export type CandidateMoves = string[];

export type SquareCoords = {
  rank: number;
  file: number;
};

export type GameStatus = "ongoing" | "promoting" | "white-wins" | "black-wins";

export type GameState = {
  position: Position[];
  turn: "w" | "b";
  candidateMoves: CandidateMoves;
  status: GameStatus;
  promotion: { from: SquareCoords; to: SquareCoords } | null;
};

type Action<T extends string, P = undefined> = P extends undefined
  ? { type: T }
  : { type: T; payload: P };

export type GameAction =
  | Action<"NEW_MOVE", Position>
  | Action<"GENERATE_CANDIDATE_MOVES", CandidateMoves>
  | Action<"CLEAR_CANDIDATE_MOVES">
  | Action<"PROMOTION_OPEN", { from: SquareCoords; to: SquareCoords }>
  | Action<"PROMOTION_COMPLETE", Position>;

export interface MovesProps {
  position: Position;
  previousPosition?: Position;
  piece?: string;
  rank: number;
  file: number;
}

export type PerformMoveProps = {
  position: Position;
  piece: string;
  rank: number;
  file: number;
  square: SquareCoords;
};
