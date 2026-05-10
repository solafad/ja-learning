"use client";

import { useEffect, useRef, useState } from "react";

const BASE_URL =
  "https://raw.githubusercontent.com/remvze/moodist/main/public/sounds/nature/";

const SOUNDS = [
  { id: "campfire", label: "Campfire", emoji: "🔥", file: "campfire.mp3" },
  { id: "droplets", label: "Droplets", emoji: "💧", file: "droplets.mp3" },
  { id: "howling-wind", label: "Howling Wind", emoji: "🌬️", file: "howling-wind.mp3" },
  { id: "jungle", label: "Jungle", emoji: "🌿", file: "jungle.mp3" },
  { id: "river", label: "River", emoji: "🏞️", file: "river.mp3" },
  { id: "walk-in-snow", label: "Walk in Snow", emoji: "❄️", file: "walk-in-snow.mp3" },
  { id: "walk-on-gravel", label: "Walk on Gravel", emoji: "🪨", file: "walk-on-gravel.mp3" },
  { id: "walk-on-leaves", label: "Walk on Leaves", emoji: "🍂", file: "walk-on-leaves.mp3" },
  { id: "waterfall", label: "Waterfall", emoji: "💦", file: "waterfall.mp3" },
  { id: "waves", label: "Waves", emoji: "🌊", file: "waves.mp3" },
  { id: "wind-in-trees", label: "Wind in Trees", emoji: "🌳", file: "wind-in-trees.mp3" },
  { id: "wind", label: "Wind", emoji: "💨", file: "wind.mp3" },
];

type SoundState = {
  active: boolean;
  volume: number; // 0–1
  loading: boolean;
};

export default function NatureSounds() {
  const [states, setStates] = useState<Record<string, SoundState>>(() =>
    Object.fromEntries(
      SOUNDS.map((s) => [s.id, { active: false, volume: 0.7, loading: false }])
    )
  );

  const audiosRef = useRef<Record<string, HTMLAudioElement>>({});

  // Initialise audio elements once on mount
  useEffect(() => {
    SOUNDS.forEach((s) => {
      const audio = new Audio();
      audio.src = BASE_URL + s.file;
      audio.loop = true;
      audio.preload = "none";
      audio.volume = 0.7;
      audiosRef.current[s.id] = audio;
    });

    return () => {
      Object.values(audiosRef.current).forEach((a) => {
        a.pause();
        a.src = "";
      });
    };
  }, []);

  const toggle = (id: string) => {
    const audio = audiosRef.current[id];
    if (!audio) return;

    setStates((prev) => {
      const wasActive = prev[id].active;
      if (wasActive) {
        audio.pause();
        return { ...prev, [id]: { ...prev[id], active: false, loading: false } };
      } else {
        setStates((s) => ({ ...s, [id]: { ...s[id], loading: true } }));
        audio.play().then(() => {
          setStates((s) => ({ ...s, [id]: { ...s[id], loading: false } }));
        }).catch(() => {
          setStates((s) => ({ ...s, [id]: { ...s[id], active: false, loading: false } }));
        });
        return { ...prev, [id]: { ...prev[id], active: true } };
      }
    });
  };

  const setVolume = (id: string, vol: number) => {
    const audio = audiosRef.current[id];
    if (audio) audio.volume = vol;
    setStates((prev) => ({ ...prev, [id]: { ...prev[id], volume: vol } }));
  };

  const stopAll = () => {
    Object.values(audiosRef.current).forEach((a) => a.pause());
    setStates((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([id, s]) => [id, { ...s, active: false, loading: false }])
      )
    );
  };

  const activeCount = Object.values(states).filter((s) => s.active).length;

  return (
    // Bottom padding so the sticky dock doesn't overlap cards on mobile
    <div className={activeCount > 0 ? "pb-20 sm:pb-0" : ""}>
      {/* Sticky bottom dock on mobile / inline bar on desktop */}
      {activeCount > 0 && (
        <div className="
          fixed bottom-0 left-0 right-0 z-20
          sm:static sm:mb-6 sm:rounded-xl
          flex items-center justify-between px-4 py-3
          bg-[var(--background)] sm:bg-[var(--surface)]
          border-t sm:border border-[var(--border)]
          text-sm
        ">
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
                "flex flex-col gap-3 rounded-2xl border p-4 min-h-[120px] transition-all duration-200 cursor-pointer select-none active:scale-[0.97]",
                active
                  ? "border-[var(--accent)] bg-[var(--surface)] shadow-sm"
                  : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)]",
              ].join(" ")}
              onClick={() => toggle(sound.id)}
              onKeyDown={(e) => e.key === "Enter" || e.key === " " ? toggle(sound.id) : undefined}
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
                  className="flex items-center gap-2 pt-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-xs">🔈</span>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={(e) => setVolume(sound.id, Number(e.target.value))}
                    className="flex-1 h-2 accent-[var(--accent)] cursor-pointer"
                    style={{ touchAction: "none" }}
                  />
                  <span className="text-xs">🔊</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
