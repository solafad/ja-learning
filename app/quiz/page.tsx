import { getQuizItems } from "@/lib/quiz";
import QuizApp from "@/components/QuizApp";

export const metadata = {
  title: "Quiz — ja-learning",
  description: "Interactive vocabulary and kanji quiz",
};

export default function QuizPage() {
  const allItems = getQuizItems();

  // Build unique chapter list in order
  const seen = new Set<string>();
  const chapterLabels: { slug: string; label: string }[] = [];
  for (const item of allItems) {
    if (!seen.has(item.chapterSlug)) {
      seen.add(item.chapterSlug);
      chapterLabels.push({ slug: item.chapterSlug, label: item.chapterLabel });
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Vocabulary Quiz</h1>
        <p className="text-[var(--muted)] text-sm">
          {allItems.length} unique words across {chapterLabels.length} chapters — randomised every round
        </p>
      </div>
      <QuizApp items={allItems} chapterLabels={chapterLabels} />
    </div>
  );
}
