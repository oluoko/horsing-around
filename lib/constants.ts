import { createPosition } from "@/hooks/use-position";
import { GameState } from "@/lib/types";

export const initialGameState: GameState = {
  position: [createPosition()],
  turn: "w",
  candidateMoves: [],
};
