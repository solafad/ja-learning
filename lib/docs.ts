import fs from "fs";
import path from "path";
import matter from "gray-matter";

const DOCS_DIR = path.join(process.cwd(), "docs", "chapters");

export interface Section {
  slug: string;
  title: string;
  content: string;
}

export interface Chapter {
  slug: string;
  title: string;
  sections: Section[];
}

function formatTitle(slug: string): string {
  return slug
    .replace(/^\d+-/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getChapters(): Chapter[] {
  const entries = fs.readdirSync(DOCS_DIR, { withFileTypes: true });
  const dirs = entries
    .filter((e) => e.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name));

  return dirs.map((dir) => {
    const chapterPath = path.join(DOCS_DIR, dir.name);
    const files = fs
      .readdirSync(chapterPath)
      .filter((f) => f.endsWith(".md"))
      .sort();

    const sections: Section[] = files.map((file) => {
      const raw = fs.readFileSync(path.join(chapterPath, file), "utf-8");
      const { content } = matter(raw);
      const slug = file.replace(/\.md$/, "");
      const firstHeading = content.match(/^#\s+(.+)$/m)?.[1] ?? formatTitle(slug);
      return { slug, title: firstHeading, content };
    });

    return {
      slug: dir.name,
      title: formatTitle(dir.name),
      sections,
    };
  });
}

export function getChapter(chapterSlug: string): Chapter | undefined {
  return getChapters().find((c) => c.slug === chapterSlug);
}

export function getSection(
  chapterSlug: string,
  sectionSlug: string
): Section | undefined {
  return getChapter(chapterSlug)?.sections.find((s) => s.slug === sectionSlug);
}
