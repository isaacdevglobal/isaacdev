import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { createClient } from "@/lib/supabase/server";

export default async function CoursesPage() {
  const supabase = await createClient();

  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, slug, summary, category, level")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-bg text-white">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h1 className="text-4xl font-bold">
          <span className="text-ash">Learn</span>
          <span style={{ color: "var(--learngth)" }}>gth</span>
        </h1>
        <p className="mt-3 max-w-2xl text-white/70">
          Courses with real projects, built to prove what you can do.
        </p>

        {(courses ?? []).length === 0 ? (
          <p className="mt-12 text-white/50">No courses published yet.</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(courses ?? []).map((c) => (
              <Link
                key={c.id}
                href={`/courses/${c.slug}`}
                className="rounded-2xl bg-white/5 p-6 transition hover:bg-white/10"
                style={{ borderTop: "4px solid var(--learngth)" }}
              >
                <p className="text-xs uppercase tracking-wide text-white/50">
                  {c.category ?? "General"} · {c.level}
                </p>
                <h2 className="mt-2 text-xl font-semibold">{c.title}</h2>
                {c.summary && (
                  <p className="mt-3 text-sm text-white/70">{c.summary}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}