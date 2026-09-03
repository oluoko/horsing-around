import Board from "@/components/board";
import ThemeToggle from "@/components/ui/them-toggle";

export default function Home() {
  return (
    <div className="relative h-screen w-screen container grid grid-cols-9 items-center justify-center">
      <ThemeToggle className="fixed top-2 right-2 md:top-4 md:right-4" />

      <div className="col-span-1" />

      <Board />

      <div className="col-span-3" />
    </div>
  );
}
