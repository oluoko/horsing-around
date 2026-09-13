import { initialGameState } from "@/lib/constants";
import {
  GameAction,
  Position,
  CandidateMoves,
  SquareCoords,
  CastlingDirections,
  Turn,
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

export const updateCastling = (direction: CastlingDirections): GameAction => {
  return {
    type: "CAN_CASTLE",
    payload: direction,
  };
};

export const detectStalemate = (): GameAction => {
  return {
    type: "STALEMATE",
  };
};

export const insufficientMaterial = (): GameAction => {
  return {
    type: "INSUFFICIENT_MATERIAL",
  };
};

export const detectCheckmate = ({
  whoIsInCheckmate,
}: {
  whoIsInCheckmate: Turn | "none";
}): GameAction => {
  return {
    type: "CHECKMATE",
    payload: whoIsInCheckmate,
  };
};

export const resign = (turn: Turn): GameAction => {
  return {
    type: "RESIGN",
    payload: turn,
  };
};

export const newGame = (): GameAction => {
  return {
    type: "NEW_GAME",
    payload: initialGameState,
  };
};
