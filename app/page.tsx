import Board from "@/components/board";
import ThemeToggle from "@/components/ui/them-toggle";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4">
      <ThemeToggle className="fixed top-2 right-2 md:top-4 md:right-4" />
      <Board />
    </div>
  );
}
