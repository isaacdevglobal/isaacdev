import SiteHeader from "@/components/SiteHeader";
import CourseExplorer from "@/components/CourseExplorer";
import { createClient } from "@/lib/supabase/server";
import type { CourseItem, Progress } from "@/lib/courses";

export default async function CoursesPage() {
  const supabase = await createClient();

  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, slug, summary, category, level")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const { data: stats } = await supabase
    .from("course_rating_stats")
    .select("course_id, review_count, avg_rating");

  const statMap = new Map<string, { review_count: number; avg_rating: number }>();
  (stats ?? []).forEach((s) =>
    statMap.set(s.course_id, {
      review_count: Number(s.review_count),
      avg_rating: Number(s.avg_rating),
    })
  );

  const items: CourseItem[] = (courses ?? []).map((c) => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    summary: c.summary,
    category: c.category,
    level: c.level,
    avg_rating: statMap.get(c.id)?.avg_rating ?? 0,
    review_count: statMap.get(c.id)?.review_count ?? 0,
  }));

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let savedIds: string[] = [];
  const progress: Record<string, Progress> = {};

  if (user) {
    const { data: saved } = await supabase
      .from("saved_courses")
      .select("course_id")
      .eq("user_id", user.id);
    savedIds = (saved ?? []).map((s) => s.course_id);

    const { data: enrollments } = await supabase
      .from("enrollments")
      .select("course_id")
      .eq("user_id", user.id);
    const enrolledIds = (enrollments ?? []).map((e) => e.course_id);

    if (enrolledIds.length > 0) {
      const { data: lessons } = await supabase
        .from("lessons")
        .select("id, course_id")
        .in("course_id", enrolledIds);
      const { data: done } = await supabase
        .from("lesson_progress")
        .select("lesson_id")
        .eq("user_id", user.id);
      const doneSet = new Set((done ?? []).map((d) => d.lesson_id));

      for (const id of enrolledIds) {
        const ls = (lessons ?? []).filter((l) => l.course_id === id);
        progress[id] = {
          done: ls.filter((l) => doneSet.has(l.id)).length,
          total: ls.length,
        };
      }
    }
  }

  return (
    <main className="min-h-screen bg-bg text-white">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h1 className="text-4xl font-bold sm:text-5xl">
          <span className="text-ash">Learn</span>
          <span style={{ color: "var(--learngth)" }}>gth</span>
        </h1>
        <p className="mt-3 mb-10 max-w-2xl text-white/70">
          Courses with real projects, built to prove what you can do.
        </p>

        <CourseExplorer
          courses={items}
          userId={user?.id ?? null}
          savedIds={savedIds}
          progress={progress}
        />
      </section>
    </main>
  );
}