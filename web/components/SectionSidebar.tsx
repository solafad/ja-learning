"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface Section {
  slug: string;
  title: string;
}

interface Props {
  chapterSlug: string;
  chapterTitle: string;
  sections: Section[];
}

export default function SectionSidebar({ chapterSlug, chapterTitle, sections }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const currentSection = sections.find((s) => pathname === `/${chapterSlug}/${s.slug}`);

  return (
    <>
      {/* Mobile: collapsible section picker */}
      <div className="md:hidden w-full mb-4">
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm"
        >
          <span className="font-medium truncate text-[var(--foreground)]">
            {currentSection?.title ?? chapterTitle}
          </span>
          <span className="ml-2 text-[var(--muted)] shrink-0">{open ? "▲" : "▼"}</span>
        </button>
        {open && (
          <nav className="mt-1 border border-[var(--border)] rounded-xl bg-[var(--surface)] overflow-hidden">
            {sections.map((section, i) => {
              const href = `/${chapterSlug}/${section.slug}`;
              const isActive = pathname === href;
              return (
                <Link
                  key={section.slug}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "bg-[var(--surface-hover)] text-[var(--foreground)] font-medium"
                      : "text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <span className={`text-xs w-4 text-center shrink-0 ${isActive ? "text-[var(--accent)]" : "text-[var(--border)]"}`}>
                    {i + 1}
                  </span>
                  <span>{section.title}</span>
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      {/* Desktop: sticky sidebar */}
      <aside className="hidden md:block w-56 shrink-0">
        <div className="sticky top-20">
          <Link
            href={`/${chapterSlug}`}
            className="block text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-3 hover:text-[var(--foreground)] transition-colors"
          >
            {chapterTitle}
          </Link>
          <nav className="flex flex-col gap-0.5">
            {sections.map((section, i) => {
              const href = `/${chapterSlug}/${section.slug}`;
              const isActive = pathname === href;
              return (
                <Link
                  key={section.slug}
                  href={href}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-[var(--surface-hover)] text-[var(--foreground)] font-medium"
                      : "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <span className={`text-xs w-4 text-center shrink-0 ${isActive ? "text-[var(--accent)]" : "text-[var(--border)]"}`}>
                    {i + 1}
                  </span>
                  <span className="leading-snug">{section.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
