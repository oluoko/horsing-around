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

export type CastlingDirections = "both" | "king-side" | "queen-side" | "none";

export type AllCastlingDirections = {
  w: CastlingDirections;
  b: CastlingDirections;
};

export type SquareCoords = {
  rank: number;
  file: number;
};

export type GameStatus =
  | "ongoing"
  | "promoting"
  | "stalemate"
  | "insufficient"
  | "white-wins"
  | "black-wins"
  | "white-resigns"
  | "black-resigns";

export type Turn = "w" | "b";

export type GameState = {
  position: Position[];
  turn: Turn;
  candidateMoves: CandidateMoves;
  status: GameStatus;
  promotion: { from: SquareCoords; to: SquareCoords } | null;
  castlingDirections: AllCastlingDirections;
};

type Action<T extends string, P = undefined> = P extends undefined
  ? { type: T }
  : { type: T; payload: P };

export type GameAction =
  | Action<"NEW_MOVE", Position>
  | Action<"CAN_CASTLE", CastlingDirections>
  | Action<"GENERATE_CANDIDATE_MOVES", CandidateMoves>
  | Action<"CLEAR_CANDIDATE_MOVES">
  | Action<"PROMOTION_OPEN", { from: SquareCoords; to: SquareCoords }>
  | Action<"PROMOTION_COMPLETE", Position>
  | Action<"STALEMATE">
  | Action<"INSUFFICIENT_MATERIAL">
  | Action<"CHECKMATE", Turn | "none">
  | Action<"RESIGN", Turn>
  | Action<"NEW_GAME", GameState>;

export interface MovesProps {
  position: Position;
  previousPosition?: Position;
  castlingDirections?: CastlingDirections;
  piece?: Piece;
  rank: number;
  file: number;
  square?: SquareCoords;
}
