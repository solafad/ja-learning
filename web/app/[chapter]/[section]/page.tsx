import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getChapters, getChapter, getSection } from "@/lib/docs";

export async function generateStaticParams() {
  return getChapters().flatMap((chapter) =>
    chapter.sections.map((section) => ({
      chapter: chapter.slug,
      section: section.slug,
    }))
  );
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ chapter: string; section: string }>;
}) {
  const { chapter: chapterSlug, section: sectionSlug } = await params;
  const chapter = getChapter(chapterSlug);
  const section = getSection(chapterSlug, sectionSlug);
  if (!chapter || !section) notFound();

  const currentIndex = chapter.sections.findIndex((s) => s.slug === sectionSlug);
  const prev = chapter.sections[currentIndex - 1];
  const next = chapter.sections[currentIndex + 1];

  return (
    <div>
      <nav className="text-sm text-[var(--muted)] mb-6 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/${chapterSlug}`} className="hover:text-[var(--foreground)] transition-colors">{chapter.title}</Link>
        <span>/</span>
        <span className="text-[var(--foreground)]">{section.slug}</span>
      </nav>

      <article className="prose max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {section.content}
        </ReactMarkdown>
      </article>

      <div className="mt-12 pt-6 border-t border-[var(--border)] flex items-center justify-between gap-4">
        {prev ? (
          <Link
            href={`/${chapterSlug}/${prev.slug}`}
            className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <span>←</span>
            <span>{prev.title}</span>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/${chapterSlug}/${next.slug}`}
            className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <span>{next.title}</span>
            <span>→</span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
