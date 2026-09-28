import Board from "@/components/board";
import Control from "@/components/control";
import MovesList from "@/components/control/moves-list";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full flex flex-col md:flex-row items-center justify-center p-2 gap-2">
      <Board />
      <Control>
        <MovesList />
      </Control>
    </div>
  );
}
