import Board from "@/components/board";
import Control from "@/components/control";
import MovesList from "@/components/control/moves-list";
import ThemeToggle from "@/components/ui/them-toggle";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full flex flex-col md:flex-row items-center justify-center p-2 gap-2">
      <ThemeToggle className="fixed top-2 right-2 md:top-4 md:right-4" />
      <Board />
      <Control>
        <MovesList />
      </Control>
    </div>
  );
}
