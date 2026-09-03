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

export type GameState = {
  position: Position[];
  turn: "w" | "b";
};

export type GameActionType = "NEW_MOVE" | "";

export type GameAction = {
  type: GameActionType;
  payload: Position;
};
