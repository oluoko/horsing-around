import { GameAction, GameState, GameStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { newGame } from "@/actions/game";
import { useBoardContext } from "@/context/board-context";

export default function GameEnds({ status }: { status: GameStatus }) {
  const { boardState, dispatch } = useBoardContext() as {
    boardState: GameState;
    dispatch: (action: GameAction) => void;
  };

  const turn = boardState.turn;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="flex flex-col justify-center items-center gap-2 md:gap-4 rounded-md overflow-hidden shadow-xl border bg-background text-foreground mx-auto p-2 md:p-4">
        <div className="">
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
            <>White has ended the game in checkmate.</>
          )}
          {status === "black-wins" && (
            <>Black has ended the game in checkmate.</>
          )}
          {status === "white-resigns" && <>Black wins. White has resigned.</>}
          {status === "black-resigns" && <>White wins. Black has resigned.</>}
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
