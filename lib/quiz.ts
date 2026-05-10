import fs from "fs";
import path from "path";

const DOCS_DIR = path.join(process.cwd(), "docs", "chapters");

export interface QuizItem {
  id: string;
  japanese: string;
  romaji: string;
  english: string;
  chapterSlug: string;
  chapterLabel: string; // e.g. "Chapter 1: Emotions"
  sectionSlug: string;
}

function slugToChapterLabel(slug: string): string {
  // e.g. "chapter-01-emotions" → "Chapter 1: Emotions"
  const match = slug.match(/^chapter-(\d+)-(.+)$/);
  if (!match) return slug;
  const num = parseInt(match[1], 10);
  const topic = match[2]
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return `Chapter ${num}: ${topic}`;
}

function parseVocabTable(content: string): Array<{ japanese: string; romaji: string; english: string }> {
  const items: Array<{ japanese: string; romaji: string; english: string }> = [];
  const lines = content.split("\n");

  let inTable = false;
  let headerParsed = false;
  let colJa = -1;
  let colRo = -1;
  let colEn = -1;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("|")) {
      if (inTable) {
        inTable = false;
        headerParsed = false;
        colJa = -1;
        colRo = -1;
        colEn = -1;
      }
      continue;
    }

    const cells = trimmed
      .split("|")
      .map((c) => c.trim())
      .filter((_, i, arr) => i > 0 && i < arr.length - 1); // strip leading/trailing empty from split

    // separator row
    if (cells.every((c) => /^[-:]+$/.test(c))) {
      inTable = true;
      continue;
    }

    if (!headerParsed && !inTable) {
      // potential header row
      const lower = cells.map((c) => c.toLowerCase());
      colJa = lower.findIndex((c) => c.includes("japanese") || c === "kanji");
      colRo = lower.findIndex((c) => c.includes("romaji") || c.includes("reading"));
      colEn = lower.findIndex(
        (c) =>
          c.includes("english") ||
          c.includes("meaning") ||
          c === "english" ||
          c.includes("english")
      );
      if (colJa >= 0 && colEn >= 0) {
        headerParsed = true;
      }
      continue;
    }

    if (inTable && headerParsed && cells.length >= 2) {
      const japanese = cells[colJa] ?? "";
      const romaji = colRo >= 0 ? (cells[colRo] ?? "") : "";
      const english = cells[colEn] ?? "";

      // skip empty or header-like rows
      if (!japanese || !english) continue;
      if (/^[-:]+$/.test(japanese)) continue;
      // skip "Your Answer" rows (from quiz files)
      if (english.toLowerCase().includes("your answer")) continue;
      // skip rows where English is clearly a label (e.g. "Meaning")
      if (english.toLowerCase() === "meaning" || english.toLowerCase() === "english") continue;

      items.push({ japanese, romaji, english });
    }
  }

  return items;
}

export function getQuizItems(): QuizItem[] {
  const items: QuizItem[] = [];

  const dirs = fs
    .readdirSync(DOCS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && /^chapter-\d+/.test(e.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  for (const dir of dirs) {
    const chapterSlug = dir.name;
    const chapterLabel = slugToChapterLabel(chapterSlug);
    const chapterPath = path.join(DOCS_DIR, chapterSlug);

    const files = fs
      .readdirSync(chapterPath)
      .filter((f) => f.endsWith(".md"))
      .sort();

    for (const file of files) {
      const sectionSlug = file.replace(/\.md$/, "");
      const content = fs.readFileSync(path.join(chapterPath, file), "utf-8");
      const vocabItems = parseVocabTable(content);

      for (let i = 0; i < vocabItems.length; i++) {
        const { japanese, romaji, english } = vocabItems[i];
        items.push({
          id: `${chapterSlug}__${sectionSlug}__${i}`,
          japanese,
          romaji,
          english,
          chapterSlug,
          chapterLabel,
          sectionSlug,
        });
      }
    }
  }

  // deduplicate by japanese+english
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.japanese}|${item.english}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function getChapterSlugs(): string[] {
  return fs
    .readdirSync(DOCS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && /^chapter-\d+/.test(e.name))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((e) => e.name);
}
