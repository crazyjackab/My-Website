"use client";

import { createContext, useContext } from "react";

interface ThemeContextValue {
  recruiterMode: boolean;
}

export const ThemeContext = createContext<ThemeContextValue>({ recruiterMode: false });

export function useTheme() {
  return useContext(ThemeContext);
}
