import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";

const LIGHT = "#E8E8D0";
const DARK = "#4B7399";

interface SquareProps {
  isDark: boolean;
  rankLabel?: number;
  className?: string;
  fileLabel?: string;
}

export default function Square({
  isDark,
  rankLabel,
  className,
  fileLabel,
}: SquareProps) {
  const labelColor = isDark ? LIGHT : DARK;
  const style: CSSProperties = { backgroundColor: isDark ? DARK : LIGHT };

  return (
    <div
      className={cn("relative col-span-1 row-span-1", className)}
      style={style}
    >
      {rankLabel !== undefined && (
        <span
          className="absolute top-0.5 left-1 text-xs md:text-lg font-semibold select-none"
          style={{ color: labelColor }}
        >
          {rankLabel}
        </span>
      )}
      {fileLabel && (
        <span
          className="absolute top-0.5 right-1 text-xs md:text-lg font-semibold select-none"
          style={{ color: labelColor }}
        >
          {fileLabel}
        </span>
      )}
    </div>
  );
}
