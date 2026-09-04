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

export type GameState = {
  position: Position[];
  turn: "w" | "b";
  candidateMoves: CandidateMoves;
};

export type MoveActionType =
  | "NEW_MOVE"
  | "GENERATE_CANDIDATE_MOVES"
  | "CLEAR_CANDIDATES_MOVES";

export type NewMoveAction = {
  type: "NEW_MOVE";
  payload: Position;
};

export type GenerateCandidateMovesAction = {
  type: "GENERATE_CANDIDATE_MOVES";
  payload: CandidateMoves;
};

export type ClearCandidateMoveAction = {
  type: "CLEAR_CANDIDATE_MOVES";
};

export type GameAction =
  | NewMoveAction
  | GenerateCandidateMovesAction
  | ClearCandidateMoveAction;
