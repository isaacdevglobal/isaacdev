import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { categoryGradient, categoryIcon } from "@/lib/courses";

export default async function FeaturedCourses() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("courses")
    .select("id, title, slug, summary, category, level")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(3);
  const courses = data ?? [];

  if (courses.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="flex items-end justify-between">
        <h2 className="text-3xl font-bold">Start learning today</h2>
        <Link
          href="/courses"
          className="text-sm font-medium hover:underline"
          style={{ color: "#4da3ff" }}
        >
          See all courses →
        </Link>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <Link
            key={c.id}
            href={`/courses/${c.slug}`}
            className="group overflow-hidden rounded-2xl bg-white/5 transition duration-200 hover:-translate-y-1 hover:bg-white/10 hover:shadow-xl hover:shadow-black/30"
          >
            <div
              className="flex h-28 items-center justify-center text-5xl"
              style={{ background: categoryGradient(c.category) }}
            >
              <span className="inline-block transition-transform duration-200 group-hover:scale-125">
                {categoryIcon(c.category)}
              </span>
            </div>
            <div className="p-5">
              <p className="text-xs uppercase tracking-wide text-white/50">
                {c.category ?? "General"} · {c.level}
              </p>
              <h3 className="mt-2 text-lg font-semibold">{c.title}</h3>
              {c.summary && (
                <p className="mt-2 line-clamp-2 text-sm text-white/70">
                  {c.summary}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}