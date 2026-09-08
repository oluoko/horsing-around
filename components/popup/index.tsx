"use client";

import PromotionBox, {
  promotionOptions,
} from "@/components/popup/promotion-box";
import { useBoardContext } from "@/context/board-context";
import { completePromotion } from "@/context/actions/move";
import arbiter from "@/lib/arbiter";
import { GameAction, GameState } from "@/lib/types";

export default function Popup() {
  const { boardState, dispatch } = useBoardContext() as {
    boardState: GameState;
    dispatch: (action: GameAction) => void;
  };

  if (boardState.status !== "promoting" || !boardState.promotion) {
    return null;
  }

  const { from, to } = boardState.promotion;
  const currentPosition = boardState.position[boardState.position.length - 1];

  const onOptionSelect = (option: (typeof promotionOptions)[number]) => {
    const piece = `${boardState.turn}${option}`;

    const newPosition = arbiter.performMove({
      position: currentPosition,
      piece,
      rank: from.rank,
      file: from.file,
      square: to,
    });

    dispatch(completePromotion(newPosition));
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
      <PromotionBox color={boardState.turn} onSelect={onOptionSelect} />
    </div>
  );
}
