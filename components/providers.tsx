"use client";

import { ReactNode, useReducer } from "react";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "@/components/theme-provider";
import BoardContext from "@/context/board-context";
import { boardReducer } from "@/context/board-reducer";
import { initialGameState } from "@/lib/constants";
export default function AppProviders({ children }: { children: ReactNode }) {
  const [boardState, dispatch] = useReducer(boardReducer, initialGameState);

  const boardProviderState = {
    boardState,
    dispatch,
  };
  return (
    <BoardContext.Provider value={boardProviderState}>
      <ThemeProvider>
        <NextTopLoader
          color="#CE974E"
          showSpinner={false}
          shadow="0 0 10px #CE974E"
        />
        {children}
      </ThemeProvider>
    </BoardContext.Provider>
  );
}
