import { GameAction, Position, CandidateMoves } from "@/lib/types";

export const makeNewMove = (newPosition: Position): GameAction => {
  return {
    type: "NEW_MOVE",
    payload: newPosition,
  };
};

export const generateCandidateMoves = (
  candidateMoves: CandidateMoves,
): GameAction => {
  return {
    type: "GENERATE_CANDIDATE_MOVES",
    payload: candidateMoves,
  };
};

export const clearCandidates = (): GameAction => {
  return {
    type: "CLEAR_CANDIDATE_MOVES",
  };
};
