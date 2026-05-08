"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface Section {
  slug: string;
  title: string;
  content: string;
}

interface Props {
  chapterSlug: string;
  sections: Section[];
}

function highlight(text: string, query: string): string {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(
    new RegExp(`(${escaped})`, "gi"),
    '<mark class="bg-[var(--accent)] text-[var(--accent-fg)] rounded px-0.5">$1</mark>'
  );
}

function getSnippet(content: string, query: string, radius = 80): string {
  const plain = content.replace(/[#*`|_~]/g, "").replace(/\n+/g, " ").trim();
  const idx = plain.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return "";
  const start = Math.max(0, idx - radius);
  const end = Math.min(plain.length, idx + query.length + radius);
  return (start > 0 ? "…" : "") + plain.slice(start, end) + (end < plain.length ? "…" : "");
}

export default function SectionSearch({ chapterSlug, sections }: Props) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sections.map((s) => ({ ...s, snippet: "" }));
    return sections
      .filter((s) => s.title.toLowerCase().includes(q) || s.content.toLowerCase().includes(q))
      .map((s) => ({
        ...s,
        snippet: s.title.toLowerCase().includes(q) ? "" : getSnippet(s.content, query.trim()),
      }));
  }, [query, sections]);

  return (
    <div>
      <div className="relative mb-6">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search sections…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <p className="text-sm text-[var(--muted)] text-center py-8">
          No sections match &ldquo;{query}&rdquo;
        </p>
      ) : (
        <div className="grid gap-3">
          {results.map((section) => (
            <Link
              key={section.slug}
              href={`/${chapterSlug}/${section.slug}`}
              className="flex items-start gap-4 border border-[var(--border)] rounded-xl px-5 py-4 hover:border-[var(--muted)] hover:bg-[var(--surface)] transition-all group"
            >
              <span className="text-2xl font-bold text-[var(--border)] group-hover:text-[var(--muted)] w-8 shrink-0 transition-colors pt-0.5">
                {parseInt(section.slug.replace(/\D/g, ""), 10)}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className="font-medium group-hover:underline"
                  dangerouslySetInnerHTML={{ __html: highlight(section.title, query.trim()) }}
                />
                {section.snippet ? (
                  <p
                    className="text-xs text-[var(--muted)] mt-1 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: highlight(section.snippet, query.trim()) }}
                  />
                ) : (
                  <p className="text-xs text-[var(--muted)] mt-0.5">{section.slug}</p>
                )}
              </div>
              <span className="ml-auto text-[var(--muted)] opacity-50 group-hover:translate-x-0.5 transition-transform pt-1 shrink-0">→</span>
            </Link>
          ))}
        </div>
      )}

      {query && results.length > 0 && (
        <p className="text-xs text-[var(--muted)] mt-4 text-center">
          {results.length} of {sections.length} section{sections.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
