import { AspectRatio } from "@/components/ui/aspect-ratio";
import { getCharacter } from "@/lib/utils";
import Square from "@/components/board/bits/square";
import Pieces from "@/components/board/bits/pieces";

export default function Board() {
  const ranks = Array.from({ length: 8 }, (_, i) => 8 - i);
  const files = Array.from({ length: 8 }, (_, i) => i + 1);

  const isDarkSquare = (rank: number, file: number): boolean => {
    return (rank + file) % 2 === 0;
  };

  return (
    <div className="size-[95vw] md:size-[95vh] p-1 bg-red-950/70">
      <AspectRatio ratio={1}>
        <div className="grid grid-cols-8 grid-rows-8 size-full">
          {ranks.map((rank) =>
            files.map((file) => (
              <Square
                key={`${file}-${rank}`}
                isDark={isDarkSquare(rank, file)}
                rankLabel={file === 1 ? rank : undefined}
                fileLabel={rank === 1 ? getCharacter(file) : undefined}
              />
            )),
          )}
        </div>
        <Pieces />
      </AspectRatio>
    </div>
  );
}
