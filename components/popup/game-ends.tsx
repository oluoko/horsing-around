import { GameAction, GameState, GameStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { newGame } from "@/actions/game";
import { useBoardContext } from "@/context/board-context";
import { PieceImage } from "@/components/board/bits/pieces";

export default function GameEnds({ status }: { status: GameStatus }) {
  const { boardState, dispatch } = useBoardContext() as {
    boardState: GameState;
    dispatch: (action: GameAction) => void;
  };

  const turn = boardState.turn;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="flex flex-col justify-center items-center gap-2 md:gap-4 rounded-md overflow-hidden shadow-xl border bg-background text-foreground mx-auto p-2 md:p-4 w-[90vw] md:w-[35vw]">
        <div className="flex flex-col justify-center items-center gap-2">
          {status === "stalemate" && (
            <>
              The game draws due to stalemate. The{" "}
              {turn === "w" ? "white" : "black"} king can&apos;t move
            </>
          )}
          {status === "insufficient" && (
            <>The game draws due to insufficient material.</>
          )}
          {status === "white-wins" && (
            <>
              <PieceImage piece="wk" />
              <p>White has ended the game in checkmate.</p>
            </>
          )}
          {status === "black-wins" && (
            <>
              <PieceImage piece="bk" />
              <p>Black has ended the game in checkmate.</p>
            </>
          )}
          {status === "white-resigns" && (
            <>
              <PieceImage piece="bk" />
              <p>Black wins. White has resigned.</p>
            </>
          )}
          {status === "black-resigns" && (
            <>
              <PieceImage piece="wk" />
              <p>White wins. Black has resigned.</p>
            </>
          )}
        </div>
        <div className="gap-2 flex w-full">
          <Button
            className="w-1/2"
            onClick={() => {
              dispatch(newGame());
            }}
            disabled={!dispatch}
          >
            New Game
          </Button>
          <Button
            className="w-1/2"
            onClick={newGame}
            variant={"secondary"}
            disabled
          >
            Rematch
          </Button>
        </div>

        <Button
          className="w-full bg-green-900 text-background"
          onClick={() => {}}
          variant={"secondary"}
          disabled
        >
          Review Game
        </Button>
      </div>
    </div>
  );
}
