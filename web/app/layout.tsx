import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import ThemeProvider from "@/components/ThemeProvider";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ja-learning",
  description: "Japanese B1 study notes from Busuu",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" data-theme="light" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <ThemeProvider>
          <header className="border-b border-[var(--border)] sticky top-0 z-10 bg-[var(--background)] backdrop-blur">
            <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
              <Link href="/" className="font-bold text-lg tracking-tight hover:opacity-70 transition-opacity">
                🇯🇵 ja-learning
              </Link>
              <span className="text-xs text-[var(--muted)] font-mono">Intermediate B1 · Busuu</span>
              <ThemeSwitcher />
            </div>
          </header>
          <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
            {children}
          </main>
          <footer className="border-t border-[var(--border)] text-center text-xs text-[var(--muted)] py-4">
            Japanese Intermediate B1 — Busuu
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
