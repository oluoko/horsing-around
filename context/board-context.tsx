"use client";

import { createContext, useContext } from "react";

const BoardContext = createContext({});

export function useBoardContext() {
  return useContext(BoardContext);
}

export default BoardContext;
