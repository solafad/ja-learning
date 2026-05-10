"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import type { QuizItem } from "@/lib/quiz";

type Mode = "jp-en" | "en-jp" | "romaji";
type Filter = "all" | string;

interface Props {
  items: QuizItem[];
  chapterLabels: { slug: string; label: string }[];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickWrongOptions(allItems: QuizItem[], correct: QuizItem, field: "english" | "japanese" | "romaji", count = 3): string[] {
  const pool = allItems
    .filter((item) => item.id !== correct.id && item[field] !== correct[field])
    .map((item) => item[field]);
  return shuffle(pool).slice(0, count);
}

function playSound(correct: boolean) {
  try {
    const ctx = new AudioContext();
    const gain = ctx.createGain();
    gain.connect(ctx.destination);

    if (correct) {
      // Short ascending two-note chime
      const notes = [523.25, 783.99]; // C5, G5
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = freq;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
        g.gain.linearRampToValueAtTime(0.25, ctx.currentTime + i * 0.12 + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.25);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.25);
      });
    } else {
      // Low short buzz
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.value = 160;
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    }

    // Close context after sounds finish
    setTimeout(() => ctx.close(), 800);
  } catch {
    // AudioContext not available (e.g. SSR) — silently ignore
  }
}

export default function QuizApp({ items, chapterLabels }: Props) {
  const [mode, setMode] = useState<Mode>("jp-en");
  const [filter, setFilter] = useState<Filter>("all");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [queue, setQueue] = useState<QuizItem[]>([]);
  const [started, setStarted] = useState(false);

  const filteredItems = useMemo(() => {
    const base = filter === "all" ? items : items.filter((i) => i.chapterSlug === filter);
    return base;
  }, [items, filter]);

  const startQuiz = useCallback(() => {
    const q = shuffle(filteredItems).slice(0, 20);
    setQueue(q);
    setQuestionIndex(0);
    setSelected(null);
    setScore(0);
    setTotal(0);
    setStreak(0);
    setBestStreak(0);
    setQuizDone(false);
    setStarted(true);
  }, [filteredItems]);

  const currentItem = queue[questionIndex];

  const { questionText, correctAnswer, answerField } = useMemo(() => {
    if (!currentItem) return { questionText: "", correctAnswer: "", answerField: "english" as const };
    if (mode === "jp-en") {
      return {
        questionText: currentItem.japanese,
        correctAnswer: currentItem.english,
        answerField: "english" as const,
      };
    } else if (mode === "en-jp") {
      return {
        questionText: currentItem.english,
        correctAnswer: currentItem.japanese,
        answerField: "japanese" as const,
      };
    } else {
      return {
        questionText: currentItem.japanese,
        correctAnswer: currentItem.romaji || currentItem.english,
        answerField: (currentItem.romaji ? "romaji" : "english") as "romaji" | "english",
      };
    }
  }, [currentItem, mode]);

  const options = useMemo(() => {
    if (!currentItem) return [];
    const wrongs = pickWrongOptions(items, currentItem, answerField, 3);
    const all = shuffle([correctAnswer, ...wrongs.slice(0, 3)]);
    return all;
  }, [currentItem, correctAnswer, answerField, items]);

  const handleSelect = (opt: string) => {
    if (selected !== null) return;
    setSelected(opt);
    const isCorrect = opt === correctAnswer;
    playSound(isCorrect);
    const newTotal = total + 1;
    const newScore = isCorrect ? score + 1 : score;
    const newStreak = isCorrect ? streak + 1 : 0;
    const newBest = Math.max(bestStreak, newStreak);
    setTotal(newTotal);
    setScore(newScore);
    setStreak(newStreak);
    setBestStreak(newBest);
  };

  const handleNext = useCallback(() => {
    if (questionIndex + 1 >= queue.length) {
      setQuizDone(true);
    } else {
      setQuestionIndex((i) => i + 1);
      setSelected(null);
    }
  }, [questionIndex, queue.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && selected !== null && started && !quizDone) {
        handleNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, started, quizDone, handleNext]);

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  // ── Settings screen ──────────────────────────────────────────
  if (!started || quizDone) {
    return (
      <div className="max-w-xl mx-auto">
        {quizDone && (
          <div className="mb-8 p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-center">
            <div className="text-4xl mb-3">
              {percentage >= 80 ? "🎉" : percentage >= 50 ? "💪" : "📖"}
            </div>
            <h2 className="text-2xl font-bold mb-1">
              {score} / {total} correct
            </h2>
            <p className="text-[var(--muted)] text-sm mb-4">{percentage}% accuracy · Best streak: {bestStreak}</p>
            <div className="w-full bg-[var(--border)] rounded-full h-2 mb-6">
              <div
                className="h-2 rounded-full transition-all"
                style={{
                  width: `${percentage}%`,
                  background: percentage >= 80 ? "var(--accent)" : percentage >= 50 ? "#f59e0b" : "#ef4444",
                }}
              />
            </div>
          </div>
        )}

        <h1 className="text-2xl font-bold mb-6">{quizDone ? "Play Again?" : "Quiz Settings"}</h1>

        {/* Mode */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2 text-[var(--muted)] uppercase tracking-wide">
            Mode
          </label>
          <div className="grid grid-cols-3 gap-2">
            {([
              { value: "jp-en", label: "Japanese → English", icon: "🇯🇵" },
              { value: "en-jp", label: "English → Japanese", icon: "🔄" },
              { value: "romaji", label: "Japanese → Romaji", icon: "🔤" },
            ] as { value: Mode; label: string; icon: string }[]).map((m) => (
              <button
                key={m.value}
                onClick={() => setMode(m.value)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-sm font-medium transition-all ${
                  mode === m.value
                    ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)]"
                    : "border-[var(--border)] hover:border-[var(--muted)] bg-[var(--surface)]"
                }`}
              >
                <span className="text-lg">{m.icon}</span>
                <span className="text-xs text-center leading-tight">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chapter filter */}
        <div className="mb-8">
          <label className="block text-sm font-semibold mb-2 text-[var(--muted)] uppercase tracking-wide">
            Chapter
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                filter === "all"
                  ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)]"
                  : "border-[var(--border)] hover:border-[var(--muted)]"
              }`}
            >
              All ({items.length})
            </button>
            {chapterLabels.map((ch) => {
              const count = items.filter((i) => i.chapterSlug === ch.slug).length;
              return (
                <button
                  key={ch.slug}
                  onClick={() => setFilter(ch.slug)}
                  className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                    filter === ch.slug
                      ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)]"
                      : "border-[var(--border)] hover:border-[var(--muted)]"
                  }`}
                >
                  {ch.label.replace("Chapter ", "Ch.")} ({count})
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={startQuiz}
          disabled={filteredItems.length < 4}
          className="w-full py-3.5 rounded-xl font-semibold text-base bg-[var(--accent)] text-[var(--accent-fg)] hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {quizDone ? "Start New Quiz" : `Start Quiz · ${Math.min(20, filteredItems.length)} questions`}
        </button>
        {filteredItems.length < 4 && (
          <p className="text-xs text-center text-[var(--muted)] mt-2">Need at least 4 words in this chapter to start.</p>
        )}
      </div>
    );
  }

  // ── Quiz card ─────────────────────────────────────────────────
  const isCorrect = selected === correctAnswer;
  const progress = ((questionIndex) / queue.length) * 100;

  return (
    <div className="max-w-xl mx-auto">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-4 text-sm">
        <button
          onClick={() => { setStarted(false); setQuizDone(false); }}
          className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          ← Settings
        </button>
        <span className="text-[var(--muted)] font-mono text-xs">
          {questionIndex + 1} / {queue.length}
        </span>
        <span className="text-[var(--muted)] text-xs">
          ✅ {score} · 🔥 {streak}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-[var(--border)] rounded-full h-1.5 mb-6">
        <div
          className="h-1.5 rounded-full bg-[var(--accent)] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question card */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 mb-4 text-center min-h-[160px] flex flex-col items-center justify-center">
        <p className="text-xs text-[var(--muted)] mb-3 uppercase tracking-widest">
          {mode === "jp-en" ? "What does this mean?" : mode === "en-jp" ? "How do you write this?" : "What is the romaji?"}
        </p>
        <p
          className={`font-bold leading-snug ${
            mode === "en-jp" ? "text-2xl" : "text-4xl"
          }`}
          lang={mode === "en-jp" ? "en" : "ja"}
        >
          {questionText}
        </p>
        {mode === "jp-en" && currentItem.romaji && (
          <p className="text-[var(--muted)] text-sm mt-2 font-mono">
            {selected !== null ? currentItem.romaji : "・・・"}
          </p>
        )}
        <p className="text-xs text-[var(--muted)] mt-3 opacity-60">
          {currentItem.chapterLabel}
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-2 mb-4">
        {options.map((opt) => {
          let style =
            "border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--muted)] hover:bg-[var(--surface-hover)] cursor-pointer";

          if (selected !== null) {
            if (opt === correctAnswer) {
              style = "border-2 border-green-500 bg-green-500/10 text-green-700 dark:text-green-300";
            } else if (opt === selected) {
              style = "border-2 border-red-500 bg-red-500/10 text-red-700 dark:text-red-300";
            } else {
              style = "border border-[var(--border)] bg-[var(--surface)] opacity-40";
            }
          }

          return (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              className={`w-full text-left px-5 py-3.5 rounded-xl text-sm font-medium transition-all ${style}`}
              lang={mode === "jp-en" ? "en" : "ja"}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Feedback + Next */}
      {selected !== null && (
        <div className="space-y-3">
          <div
            className={`rounded-xl px-5 py-3.5 text-sm font-medium ${
              isCorrect
                ? "bg-green-500/10 text-green-700 border border-green-500/30"
                : "bg-red-500/10 text-red-700 border border-red-500/30"
            }`}
          >
            {isCorrect ? (
              <span>✅ Correct! {streak > 1 ? `🔥 ${streak} in a row!` : ""}</span>
            ) : (
              <span>
                ❌ The answer is:{" "}
                <strong lang={mode === "en-jp" ? "ja" : "en"}>{correctAnswer}</strong>
                {mode === "jp-en" && currentItem.romaji && (
                  <span className="ml-1 font-mono text-xs opacity-70">({currentItem.romaji})</span>
                )}
              </span>
            )}
          </div>
          <button
            onClick={handleNext}
            className="w-full py-3.5 rounded-xl font-semibold bg-[var(--accent)] text-[var(--accent-fg)] hover:opacity-90 transition-opacity"
          >
            {questionIndex + 1 >= queue.length ? "See Results →" : "Next →"}
          </button>
        </div>
      )}
    </div>
  );
}
