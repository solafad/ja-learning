"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

  return (
    <aside className="w-56 shrink-0">
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
  );
}
