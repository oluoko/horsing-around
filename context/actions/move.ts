import {
  GameAction,
  Position,
  CandidateMoves,
  SquareCoords,
} from "@/lib/types";

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

export const openPromotion = (payload: {
  from: SquareCoords;
  to: SquareCoords;
}): GameAction => {
  return {
    type: "PROMOTION_OPEN",
    payload,
  };
};

export const completePromotion = (newPosition: Position): GameAction => {
  return {
    type: "PROMOTION_COMPLETE",
    payload: newPosition,
  };
};
