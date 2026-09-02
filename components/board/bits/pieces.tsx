import { cn } from "@/lib/utils";

export default function Pieces() {
  const position = new Array(8).fill(" ").map(() => new Array(8).fill(" "));

  for (let i = 0; i < 8; i++) {
    position[1][i] = "wp";
    position[6][i] = "bp";
  }

  position[0][0] = "wr";
  position[0][1] = "wn";
  position[0][2] = "wb";
  position[0][3] = "wq";
  position[0][4] = "wk";
  position[0][5] = "wb";
  position[0][6] = "wn";
  position[0][7] = "wr";

  position[7][0] = "br";
  position[7][1] = "bn";
  position[7][2] = "bb";
  position[7][3] = "bq";
  position[7][4] = "bk";
  position[7][5] = "bb";
  position[7][6] = "bn";
  position[7][7] = "br";

  return (
    <div className="pieces absolute left-0 right-0 top-0 bottom-0">
      {position.map((r, rank) =>
        r.map((f, file) => (
          <div key={`${rank}-${file}`}>
            {position[rank][file] ? (
              <Piece
                key={`${rank}-${file}`}
                rank={rank}
                file={file}
                piece={position[rank][file]}
              />
            ) : null}
          </div>
        )),
      )}
    </div>
  );
}

export function Piece({
  rank,
  file,
  piece,
}: {
  rank: number;
  file: number;
  piece: string;
}) {
  return (
    <div
      className={cn(
        "piece w-[12.5%] h-[12.5%] absolute bg-center bg-size-[90%] md:bg-size-[100%] bg-no-repeat",
        `${piece}`,
        `p-${file}${rank}`,
      )}
      draggable={true}
    />
  );
}
