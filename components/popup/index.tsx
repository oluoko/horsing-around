"use client";

import PromotionBox from "@/components/popup/promotion-box";
import { useBoardContext } from "@/context/board-context";
import { clearCandidates, completePromotion } from "@/actions/game";
import arbiter from "@/lib/arbiter";
import { GameAction, GameState, Piece, PromotionOptions } from "@/lib/types";
import GameEnds from "@/components/popup/game-ends";
import { getNewMoveNotation } from "@/actions/get-moves";

export default function Popup() {
  const { boardState, dispatch } = useBoardContext() as {
    boardState: GameState;
    dispatch: (action: GameAction) => void;
  };

  if (boardState.status === "promoting" && boardState.promotion) {
    const { from, to } = boardState.promotion;
    const currentPosition = boardState.position[boardState.position.length - 1];

    const onOptionSelect = (option: PromotionOptions) => {
      const piece = `${boardState.turn}${option}` as Piece;

      const newPosition = arbiter.performMove({
        position: currentPosition,
        piece,
        rank: from.rank,
        file: from.file,
        square: to,
      });

      const newMoveNotation = getNewMoveNotation({
        rank: from.rank,
        file: from.file,
        square: to,
        piece,
        promotsTo: option,
        position: currentPosition,
      });

      dispatch(clearCandidates());
      dispatch(completePromotion(newPosition, newMoveNotation));
    };

    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
        <PromotionBox color={boardState.turn} onSelect={onOptionSelect} />
      </div>
    );
  }

  if (boardState.status === "stalemate") {
    return <GameEnds status={boardState.status} />;
  }

  if (boardState.status === "insufficient") {
    return <GameEnds status={boardState.status} />;
  }

  if (boardState.status === "white-wins") {
    return <GameEnds status={boardState.status} />;
  }

  if (boardState.status === "black-wins") {
    return <GameEnds status={boardState.status} />;
  }

  if (boardState.status === "white-resigns") {
    return <GameEnds status={boardState.status} />;
  }

  if (boardState.status === "black-resigns") {
    return <GameEnds status={boardState.status} />;
  }
}
