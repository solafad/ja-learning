"use client";

import { createContext, useContext, useEffect, useState } from "react";

export const themes = [
  { id: "light",    label: "Light",    swatch: "#ffffff" },
  { id: "dark",     label: "Dark",     swatch: "#0f0f0f" },
  { id: "sakura",   label: "Sakura",   swatch: "#fce7f3" },
  { id: "midnight", label: "Midnight", swatch: "#0f172a" },
  { id: "forest",   label: "Forest",   swatch: "#0f1f0f" },
  { id: "washi",    label: "Washi",    swatch: "#c8977b" },
] as const;

export type ThemeId = (typeof themes)[number]["id"];

const ThemeContext = createContext<{
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
}>({ theme: "light", setTheme: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>("light");

  useEffect(() => {
    const stored = localStorage.getItem("ja-theme") as ThemeId | null;
    if (stored && themes.find((t) => t.id === stored)) {
      setThemeState(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("ja-theme", theme);
  }, [theme]);

  function setTheme(t: ThemeId) {
    setThemeState(t);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
