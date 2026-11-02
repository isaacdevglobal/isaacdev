export type CourseItem = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  category: string | null;
  level: string;
  avg_rating: number;
  review_count: number;
};

export type Progress = { done: number; total: number };

const ICONS: Record<string, string> = {
  Development: "💻",
  AI: "🤖",
  Thinking: "🧠",
};

export function categoryIcon(category: string | null): string {
  return (category && ICONS[category]) || "📘";
}

export function categoryGradient(category: string | null): string {
  const key = category ?? "General";
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) % 360;
  }
  return `linear-gradient(135deg, hsl(${hash} 60% 32%), hsl(${(hash + 40) % 360} 65% 18%))`;
}