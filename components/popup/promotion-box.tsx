import { cn } from "@/lib/utils";
import { LIGHT, DARK } from "@/components/board/bits/square";
import { PromotionOptions, Turn } from "@/lib/types";

interface PromotionBoxProps {
  color: Turn;
  onSelect: (piece: PromotionOptions) => void;
}

export const promotionOptions = ["q", "r", "b", "n"] as const;

export default function PromotionBox({ color, onSelect }: PromotionBoxProps) {
  return (
    <div
      className="flex rounded-md overflow-hidden shadow-xl border"
      style={{ borderColor: DARK }}
    >
      {promotionOptions.map((option, i) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(option)}
          className={cn(
            "relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center transition-colors",
            "hover:brightness-95 cursor-pointer",
          )}
          style={{ backgroundColor: i % 2 === 0 ? LIGHT : DARK }}
        >
          <span
            className={cn(
              "piece pointer-events-none",
              `${color}${option}`,
              "w-[80%] h-[80%] bg-center bg-contain bg-no-repeat",
            )}
          />
        </button>
      ))}
    </div>
  );
}
