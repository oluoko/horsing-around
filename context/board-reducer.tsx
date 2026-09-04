import { GameAction, GameState } from "@/lib/types";

export const boardReducer = (
  state: GameState,
  action: GameAction,
): GameState => {
  switch (action.type) {
    case "NEW_MOVE": {
      let { turn, position } = state;
      turn = turn === "w" ? "b" : "w";

      position = [...position, action.payload];

      return {
        ...state,
        turn,
        position,
      };
    }

    case "GENERATE_CANDIDATE_MOVES": {
      return {
        ...state,
        candidateMoves: action.payload,
      };
    }

    case "CLEAR_CANDIDATE_MOVES": {
      return {
        ...state,
        candidateMoves: [],
      };
    }

    default:
      return state;
  }
};
