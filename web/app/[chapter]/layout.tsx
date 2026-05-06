import { notFound } from "next/navigation";
import { getChapter, getChapters } from "@/lib/docs";
import SectionSidebar from "@/components/SectionSidebar";

export async function generateStaticParams() {
  return getChapters().map((c) => ({ chapter: c.slug }));
}

export default async function ChapterLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ chapter: string }>;
}) {
  const { chapter: chapterSlug } = await params;
  const chapter = getChapter(chapterSlug);
  if (!chapter) notFound();

  const sidebarSections = chapter.sections.map((s) => ({
    slug: s.slug,
    title: s.title,
  }));

  return (
    <div className="flex flex-col md:flex-row md:gap-8 md:items-start">
      <SectionSidebar
        chapterSlug={chapterSlug}
        chapterTitle={chapter.title}
        sections={sidebarSections}
      />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
