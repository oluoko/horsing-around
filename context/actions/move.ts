import { Position } from "@/lib/types";

export const makeNewMove = (newPosition: Position) => {
  return {
    type: "NEW_MOVE",
    payload: newPosition,
  };
};
