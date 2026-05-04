import Link from "next/link";
import { notFound } from "next/navigation";
import { getChapters, getChapter } from "@/lib/docs";

export async function generateStaticParams() {
  return getChapters().map((c) => ({ chapter: c.slug }));
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ chapter: string }>;
}) {
  const { chapter: chapterSlug } = await params;
  const chapter = getChapter(chapterSlug);
  if (!chapter) notFound();

  return (
    <div>
      <nav className="text-sm text-[var(--muted)] mb-6 flex items-center gap-1.5">
        <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Home</Link>
        <span>/</span>
        <span className="text-[var(--foreground)]">{chapter.title}</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">{chapter.title}</h1>
      <p className="text-[var(--muted)] mb-8 text-sm">
        {chapter.sections.length} section{chapter.sections.length !== 1 ? "s" : ""}
      </p>

      <div className="grid gap-3">
        {chapter.sections.map((section, i) => (
          <Link
            key={section.slug}
            href={`/${chapterSlug}/${section.slug}`}
            className="flex items-center gap-4 border border-[var(--border)] rounded-xl px-5 py-4 hover:border-[var(--muted)] hover:bg-[var(--surface)] transition-all group"
          >
            <span className="text-2xl font-bold text-[var(--border)] group-hover:text-[var(--muted)] w-8 shrink-0 transition-colors">
              {i + 1}
            </span>
            <div>
              <p className="font-medium group-hover:underline">{section.title}</p>
              <p className="text-xs text-[var(--muted)] mt-0.5">{section.slug}</p>
            </div>
            <span className="ml-auto text-[var(--muted)] opacity-50 group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
