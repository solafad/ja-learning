import Link from "next/link";
import { getChapters } from "@/lib/docs";
import { getQuizItems } from "@/lib/quiz";

export default function Home() {
  const chapters = getChapters();
  const totalSections = chapters.reduce((acc, c) => acc + c.sections.length, 0);
  const totalQuizItems = getQuizItems().length;

  return (
    <div>
      {/* ── Study Notes ─────────────────────────────────────── */}
      <h1 className="text-3xl font-bold mb-2">Study Notes</h1>
      <p className="text-[var(--muted)] mb-8 text-sm">
        {totalSections} sections across {chapters.length} chapter{chapters.length !== 1 ? "s" : ""}
      </p>

      <div className="grid gap-4 mb-12">
        {chapters.map((chapter) => (
          <div
            key={chapter.slug}
            className="border border-[var(--border)] rounded-xl p-5 hover:border-[var(--muted)] transition-colors"
          >
            <Link href={`/${chapter.slug}`}>
              <h2 className="font-semibold text-lg mb-3 hover:underline">{chapter.title}</h2>
            </Link>
            <div className="flex flex-wrap gap-2">
              {chapter.sections.map((section) => (
                <Link
                  key={section.slug}
                  href={`/${chapter.slug}/${section.slug}`}
                  className="text-sm px-3 py-1 rounded-full border border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] transition-colors"
                >
                  {section.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Quizzes ─────────────────────────────────────────── */}
      <div className="border-t border-[var(--border)] pt-10">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold">Quizzes</h2>
          <Link
            href="/quiz"
            className="text-sm px-3 py-1.5 rounded-full border border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] transition-colors"
          >
            Open quiz →
          </Link>
        </div>
        <p className="text-[var(--muted)] text-sm mb-6">
          {totalQuizItems} vocabulary words — randomised multiple-choice, across all chapters
        </p>

        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              icon: "🇯🇵",
              title: "Japanese → English",
              desc: "Read Japanese, pick the English meaning",
              href: "/quiz",
            },
            {
              icon: "🔄",
              title: "English → Japanese",
              desc: "Read English, pick the Japanese word",
              href: "/quiz",
            },
            {
              icon: "🔤",
              title: "Japanese → Romaji",
              desc: "Read Japanese, pick the romaji reading",
              href: "/quiz",
            },
          ].map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="border border-[var(--border)] rounded-xl p-5 hover:border-[var(--muted)] hover:bg-[var(--surface-hover)] transition-colors flex flex-col gap-2"
            >
              <span className="text-2xl">{card.icon}</span>
              <span className="font-semibold text-sm">{card.title}</span>
              <span className="text-xs text-[var(--muted)] leading-relaxed">{card.desc}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
