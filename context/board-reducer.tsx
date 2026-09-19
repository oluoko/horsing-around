import { GameAction, GameState } from "@/lib/types";

export const boardReducer = (
  state: GameState,
  action: GameAction,
): GameState => {
  switch (action.type) {
    case "NEW_MOVE": {
      let { turn, position, movesList } = state;
      turn = turn === "w" ? "b" : "w";
      position = [...position, action.payload.newPosition];

      movesList = [...movesList, action.payload.newMoveNotation];

      return {
        ...state,
        turn,
        position,
        movesList,
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

    case "PROMOTION_OPEN": {
      return {
        ...state,
        status: "promoting",
        promotion: action.payload,
        candidateMoves: [],
      };
    }

    case "PROMOTION_COMPLETE": {
      let { turn, position, movesList } = state;
      turn = turn === "w" ? "b" : "w";
      position = [...position, action.payload.newPosition];
      movesList = [...movesList, action.payload.newMoveNotation];

      return {
        ...state,
        turn,
        position,
        movesList,
        status: "ongoing",
        promotion: null,
      };
    }

    case "CAN_CASTLE": {
      const { turn, castlingDirections } = state;
      castlingDirections[turn] = action.payload;

      return {
        ...state,
        castlingDirections,
      };
    }

    case "STALEMATE": {
      return {
        ...state,
        status: "stalemate",
      };
    }

    case "CHECKMATE": {
      const whoIsInMate = action.payload;
      return {
        ...state,
        status: whoIsInMate === "b" ? "white-wins" : "black-wins",
      };
    }

    case "INSUFFICIENT_MATERIAL": {
      return {
        ...state,
        status: "insufficient",
      };
    }

    case "RESIGN": {
      const turn = action.payload;

      return {
        ...state,
        status: turn === "w" ? "white-resigns" : "black-resigns",
      };
    }

    case "TAKE_BACK": {
      let { position, movesList, turn } = state;

      if (position.length > 1) {
        position = position.slice(0, position.length - 1);
        movesList = movesList.slice(0, movesList.length - 1);
        turn = turn === "w" ? "b" : "w";
      }

      return {
        ...state,
        position,
        movesList,
        turn,
      };
    }

    case "NEW_GAME": {
      return {
        ...action.payload,
      };
    }

    default:
      return state;
  }
};
