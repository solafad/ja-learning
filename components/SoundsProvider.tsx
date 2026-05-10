"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

export const BASE_URL =
  "https://raw.githubusercontent.com/remvze/moodist/main/public/sounds/nature/";

export const SOUNDS = [
  { id: "campfire",       label: "Campfire",       emoji: "🔥", file: "campfire.mp3" },
  { id: "droplets",       label: "Droplets",       emoji: "💧", file: "droplets.mp3" },
  { id: "howling-wind",   label: "Howling Wind",   emoji: "🌬️", file: "howling-wind.mp3" },
  { id: "jungle",         label: "Jungle",         emoji: "🌿", file: "jungle.mp3" },
  { id: "river",          label: "River",          emoji: "🏞️", file: "river.mp3" },
  { id: "walk-in-snow",   label: "Walk in Snow",   emoji: "❄️", file: "walk-in-snow.mp3" },
  { id: "walk-on-gravel", label: "Walk on Gravel", emoji: "🪨", file: "walk-on-gravel.mp3" },
  { id: "walk-on-leaves", label: "Walk on Leaves", emoji: "🍂", file: "walk-on-leaves.mp3" },
  { id: "waterfall",      label: "Waterfall",      emoji: "💦", file: "waterfall.mp3" },
  { id: "waves",          label: "Waves",          emoji: "🌊", file: "waves.mp3" },
  { id: "wind-in-trees",  label: "Wind in Trees",  emoji: "🌳", file: "wind-in-trees.mp3" },
  { id: "wind",           label: "Wind",           emoji: "💨", file: "wind.mp3" },
];

export type SoundState = {
  active: boolean;
  volume: number;
  loading: boolean;
};

type SoundsContextValue = {
  states: Record<string, SoundState>;
  toggle: (id: string) => void;
  setVolume: (id: string, vol: number) => void;
  stopAll: () => void;
  activeCount: number;
};

const SoundsContext = createContext<SoundsContextValue | null>(null);

export function useSounds() {
  const ctx = useContext(SoundsContext);
  if (!ctx) throw new Error("useSounds must be used inside SoundsProvider");
  return ctx;
}

export default function SoundsProvider({ children }: { children: React.ReactNode }) {
  const [states, setStates] = useState<Record<string, SoundState>>(() =>
    Object.fromEntries(
      SOUNDS.map((s) => [s.id, { active: false, volume: 0.7, loading: false }])
    )
  );

  const audiosRef = useRef<Record<string, HTMLAudioElement>>({});

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

  const toggle = useCallback((id: string) => {
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
  }, []);

  const setVolume = useCallback((id: string, vol: number) => {
    const audio = audiosRef.current[id];
    if (audio) audio.volume = vol;
    setStates((prev) => ({ ...prev, [id]: { ...prev[id], volume: vol } }));
  }, []);

  const stopAll = useCallback(() => {
    Object.values(audiosRef.current).forEach((a) => a.pause());
    setStates((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([id, s]) => [id, { ...s, active: false, loading: false }])
      )
    );
  }, []);

  const activeCount = Object.values(states).filter((s) => s.active).length;

  return (
    <SoundsContext.Provider value={{ states, toggle, setVolume, stopAll, activeCount }}>
      {children}
    </SoundsContext.Provider>
  );
}
