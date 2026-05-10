import Link from "next/link";
import { notFound } from "next/navigation";
import { getChapters, getChapter } from "@/lib/docs";
import SectionSearch from "@/components/SectionSearch";

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

  const sections = chapter.sections.map((s) => ({ slug: s.slug, title: s.title }));

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

      <SectionSearch chapterSlug={chapterSlug} sections={sections} />
    </div>
  );
}
