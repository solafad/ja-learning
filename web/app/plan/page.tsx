import Link from "next/link";

const days = [
  {
    day: 1,
    label: "The Grammar Foundation",
    goal: "Finish Impressions, Experiences, and the difficult Passive Voice and Conditionals (たら vs ば).",
    blockA: [2, 3, 4],
    blockB: [5, 6],
  },
  {
    day: 2,
    label: "The Social Bridge",
    goal: 'Master the "Giver/Receiver" verbs (あげる / くれる / もらう), Job Hunting, Housing, and Transitive / Intransitive verbs.',
    blockA: [7, 8, 9],
    blockB: [10, 11, 12],
  },
  {
    day: 3,
    label: "The Final Ascent",
    goal: "Cover Education, Health, Life Events, and the final boss: Honorifics (Keigo).",
    blockA: [13, 14, 15],
    blockB: [16, 17, 18],
  },
];

function ChapterPill({ n }: { n: number }) {
  return (
    <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--surface-hover)] text-[var(--muted)] border border-[var(--border)]">
      Ch {n}
    </span>
  );
}

function BlockRow({
  icon,
  label,
  hours,
  chapters,
}: {
  icon: string;
  label: string;
  hours: string;
  chapters: number[];
}) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-base">{icon}</span>
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-semibold text-[var(--foreground)]">{label}</span>
        <span className="text-xs text-[var(--muted)]">({hours})</span>
        <span className="text-xs text-[var(--muted)]">·</span>
        <span className="text-xs font-semibold text-[var(--accent)]">
          {chapters.length} chapter{chapters.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {chapters.map((n) => <ChapterPill key={n} n={n} />)}
      </div>
    </div>
  );
}

export default function PlanPage() {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-1">72-Hour Blitz</p>
        <h1 className="text-3xl font-bold mb-2">Study Plan</h1>
        <p className="text-[var(--muted)] text-sm leading-relaxed">
          Finish the remaining 17 chapters of B1 in 3 days at a Professional Immersion pace —
          roughly 5–6 chapters per day, 7–9 hours of study daily.
        </p>
      </div>

      {/* Target */}
      <div className="flex items-center gap-3 border border-[var(--accent)] rounded-xl px-5 py-4 mb-8 bg-[var(--surface)]">
        <span className="text-2xl">🎯</span>
        <div>
          <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-0.5">Target finish date</p>
          <p className="font-semibold text-[var(--foreground)]">Friday, 8 May 2026</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-0.5">Daily lessons</p>
          <p className="font-semibold text-[var(--foreground)]">~55–60</p>
        </div>
      </div>

      {/* Timeline */}
      <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--muted)] mb-4">Timeline</h2>
      <div className="flex flex-col gap-3 mb-10">
        {days.map((d) => {
          const total = d.blockA.length + d.blockB.length;
          const chRange = `${d.blockA[0]} → ${d.blockB[d.blockB.length - 1]}`;
          return (
            <div key={d.day} className="border border-[var(--border)] rounded-xl p-5 bg-[var(--surface)]">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full border-2 border-[var(--accent)] flex items-center justify-center font-bold text-[var(--accent)]">
                  {d.day}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold">{d.label}</span>
                    <span className="text-xs text-[var(--muted)] font-mono border border-[var(--border)] rounded px-1.5 py-0.5">
                      Ch. {chRange}
                    </span>
                    <span className="text-xs font-semibold text-[var(--accent)]">{total} chapters</span>
                  </div>
                  <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">{d.goal}</p>

                  <div className="flex flex-col gap-2.5 pt-3 border-t border-[var(--border)]">
                    <BlockRow icon="🌅" label="Morning" hours="4 hrs" chapters={d.blockA} />
                    <BlockRow icon="🌆" label="Afternoon" hours="4 hrs" chapters={d.blockB} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Kanji Triage */}
      <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--muted)] mb-4">Kanji Triage</h2>
      <div className="border border-[var(--border)] rounded-xl p-5 bg-[var(--surface)] mb-10">
        <p className="text-sm text-[var(--muted)] leading-relaxed">
          Expect <strong className="text-[var(--foreground)]">15–20 new kanji per day</strong>.
          Don't try to memorize stroke order for all of them — focus on recognising the{" "}
          <strong className="text-[var(--foreground)]">shape</strong> and{" "}
          <strong className="text-[var(--foreground)]">meaning</strong> to pass the matching quizzes.
        </p>
      </div>

      {/* Summary Sync */}
      <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--muted)] mb-4">Summary Sync</h2>
      <div className="border border-[var(--border)] rounded-xl p-5 bg-[var(--surface)] mb-10">
        <p className="text-sm text-[var(--muted)] leading-relaxed">
          Every time you finish a chapter, say{" "}
          <code className="text-[var(--foreground)] bg-[var(--code-bg)] px-1.5 py-0.5 rounded text-xs font-mono">
            Generate summary.
          </code>{" "}
          A distilled grammar + vocabulary markdown note will be generated so you can review quickly
          without re-opening Busuu.
        </p>
      </div>

      {/* Current Objective */}
      <div className="border-l-2 border-[var(--accent)] pl-4 mb-8">
        <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">Current objective — Day 1</p>
        <p className="text-sm text-[var(--foreground)] leading-relaxed">
          Finish the rest of Chapter 2 (starting with <em>Reading chat messages</em>) then clear
          Chapters 3, 4, 5, and 6. Tackle the は vs が lessons in your Block A session.
        </p>
      </div>

      <Link href="/" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
        ← Back to study notes
      </Link>
    </div>
  );
}
