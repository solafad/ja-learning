import NatureSounds from "@/components/NatureSounds";

export const metadata = {
  title: "Nature Sounds — ja-learning",
  description: "Ambient nature sounds for focus and study",
};

export default function SoundsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Nature Sounds</h1>
        <p className="text-[var(--muted)] text-sm">
          Mix ambient sounds to create your ideal study environment. Multiple sounds can play simultaneously.
        </p>
      </div>
      <NatureSounds />
    </div>
  );
}
