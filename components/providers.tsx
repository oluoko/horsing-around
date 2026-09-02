"use client";

import { ReactNode } from "react";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "@/components/theme-provider";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <>
      <ThemeProvider>
        <NextTopLoader
          color="#CE974E"
          showSpinner={false}
          shadow="0 0 10px #CE974E"
        />
        {children}
      </ThemeProvider>
    </>
  );
}
