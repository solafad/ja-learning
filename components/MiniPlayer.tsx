"use client";

import Link from "next/link";
import { SOUNDS, useSounds } from "./SoundsProvider";

export default function MiniPlayer() {
  const { states, stopAll, activeCount } = useSounds();

  if (activeCount === 0) return null;

  const activeSounds = SOUNDS.filter((s) => states[s.id].active);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--border)] bg-[var(--background)] backdrop-blur px-4 py-2.5">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        {/* Playing indicators */}
        <div className="flex items-center gap-1.5 flex-1 min-w-0 overflow-hidden">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse shrink-0" />
          <span className="text-xs text-[var(--muted)] truncate">
            {activeSounds.map((s) => s.emoji).join(" ")}
            {" "}
            <span className="hidden sm:inline">
              {activeSounds.map((s) => s.label).join(", ")}
            </span>
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/sounds"
            className="text-xs px-3 py-1.5 rounded-full border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--muted)] transition-colors"
          >
            Mix
          </Link>
          <button
            onClick={stopAll}
            className="text-xs px-3 py-1.5 rounded-full border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--muted)] transition-colors active:scale-95"
          >
            Stop
          </button>
        </div>
      </div>
    </div>
  );
}
