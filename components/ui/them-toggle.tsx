"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ThemeToggle({
  className,
}: {
  variant?: "button" | "icon" | "transparent";
  className?: string;
  text?: string;
}) {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant={"outline"}
      size={"icon"}
      className={cn("rounded-none", className)}
      onClick={toggleTheme}
    >
      <Sun className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 size-5 hover:animate-spin" />
      <Moon className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 size-5 hover:animate-accordion-up" />
    </Button>
  );
}
