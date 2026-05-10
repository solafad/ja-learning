"use client";

import { SOUNDS, useSounds } from "./SoundsProvider";

export default function NatureSounds() {
  const { states, toggle, setVolume, stopAll, activeCount } = useSounds();

  return (
    <div className={activeCount > 0 ? "pb-20 sm:pb-0" : ""}>
      {/* Inline bar on desktop (mobile uses the global floating MiniPlayer) */}
      {activeCount > 0 && (
        <div className="hidden sm:flex items-center justify-between px-4 py-2.5 mb-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm">
          <span className="text-[var(--muted)]">
            <span className="text-[var(--foreground)] font-semibold">{activeCount}</span>{" "}
            sound{activeCount !== 1 ? "s" : ""} playing
          </span>
          <button
            onClick={stopAll}
            className="text-xs px-4 py-2 rounded-full border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--muted)] transition-colors active:scale-95"
          >
            Stop all
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {SOUNDS.map((sound) => {
          const state = states[sound.id];
          const { active, loading, volume } = state;

          return (
            <div
              key={sound.id}
              role="button"
              tabIndex={0}
              aria-pressed={active}
              style={{ touchAction: "manipulation" }}
              className={[
                "flex flex-col gap-3 rounded-2xl border p-4 min-h-[120px] overflow-hidden transition-all duration-200 cursor-pointer select-none active:scale-[0.97]",
                active
                  ? "border-[var(--accent)] bg-[var(--surface)] shadow-sm"
                  : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)]",
              ].join(" ")}
              onClick={() => toggle(sound.id)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") ? toggle(sound.id) : undefined}
            >
              {/* Emoji + active pulse */}
              <div className="relative w-fit">
                <span className="text-3xl leading-none">{sound.emoji}</span>
                {active && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[var(--accent)] animate-pulse" />
                )}
              </div>

              {/* Label */}
              <div>
                <p className="text-sm font-medium leading-tight">{sound.label}</p>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  {loading ? "Loading…" : active ? "Playing" : "Tap to play"}
                </p>
              </div>

              {/* Volume slider — only when active */}
              {active && (
                <div
                  className="w-full min-w-0 pt-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={(e) => setVolume(sound.id, Number(e.target.value))}
                    className="w-full h-2 accent-[var(--accent)] cursor-pointer block"
                    style={{ touchAction: "none" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
