"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme, themes } from "./ThemeProvider";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const current = themes.find((t) => t.id === theme)!;

  return (
    <div ref={ref} className="relative ml-auto">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors"
        aria-label="Switch theme"
      >
        <span
          className="w-3 h-3 rounded-full border border-[var(--border)] shrink-0"
          style={{ background: current.swatch }}
        />
        <span className="text-[var(--muted)]">{current.label}</span>
        <span className="text-[var(--muted)] opacity-60">▾</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-36 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-lg overflow-hidden z-50">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTheme(t.id); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-[var(--surface-hover)] ${
                theme === t.id ? "font-medium text-[var(--foreground)]" : "text-[var(--muted)]"
              }`}
            >
              <span
                className="w-3 h-3 rounded-full border border-[var(--border)] shrink-0"
                style={{ background: t.swatch }}
              />
              {t.label}
              {theme === t.id && <span className="ml-auto text-xs opacity-60">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
