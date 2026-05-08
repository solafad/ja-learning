import Link from "next/link";
import { getChapters } from "@/lib/docs";

export default function Home() {
  const chapters = getChapters();
  const totalSections = chapters.reduce((acc, c) => acc + c.sections.length, 0);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Study Notes</h1>
      <p className="text-[var(--muted)] mb-8 text-sm">
        {totalSections} sections across {chapters.length} chapter{chapters.length !== 1 ? "s" : ""}
      </p>

      <div className="grid gap-4">
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
    </div>
  );
}
