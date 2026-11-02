import { notFound } from "next/navigation";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { createClient } from "@/lib/supabase/server";
import { youtubeEmbedUrl } from "@/lib/youtube";
import EnrollButton from "./EnrollButton";
import LessonProgressButton from "./LessonProgressButton";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("id, title, summary, description, category, level, status")
    .eq("slug", slug)
    .maybeSingle();

  if (!course) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, title, position, youtube_url, content")
    .eq("course_id", course.id)
    .order("position", { ascending: true });
  const lessonList = lessons ?? [];

  let enrolled = false;
  const completedIds = new Set<string>();

  if (user) {
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", course.id)
      .maybeSingle();
    enrolled = !!enrollment;

    if (enrolled && lessonList.length > 0) {
      const { data: progress } = await supabase
        .from("lesson_progress")
        .select("lesson_id")
        .eq("user_id", user.id)
        .in(
          "lesson_id",
          lessonList.map((l) => l.id)
        );
      (progress ?? []).forEach((p) => completedIds.add(p.lesson_id));
    }
  }

  return (
    <main className="min-h-screen bg-bg text-white">
      <SiteHeader />

      <section className="mx-auto max-w-3xl px-6 pb-24">
        <Link href="/courses" className="text-sm text-white/50 hover:text-white">
          ← All courses
        </Link>

        <p className="mt-6 text-xs uppercase tracking-wide text-white/50">
          {course.category ?? "General"} · {course.level}
          {course.status !== "published" && ` · ${course.status}`}
        </p>
        <h1 className="mt-2 text-4xl font-bold">{course.title}</h1>
        {course.summary && (
          <p className="mt-4 text-lg text-white/70">{course.summary}</p>
        )}
        {course.description && (
          <p className="mt-6 whitespace-pre-wrap text-white/80">
            {course.description}
          </p>
        )}

        <div className="mt-8">
          {!user && (
            <p className="text-white/70">
              <Link href="/signup" className="text-mint hover:underline">
                Create a free account
              </Link>{" "}
              or{" "}
              <Link href="/login" className="text-mint hover:underline">
                log in
              </Link>{" "}
              to enroll.
            </p>
          )}
          {user && !enrolled && (
            <EnrollButton courseId={course.id} userId={user.id} />
          )}
          {user && enrolled && (
            <p className="text-sm" style={{ color: "var(--learngth)" }}>
              Enrolled · {completedIds.size} of {lessonList.length} lessons
              completed
            </p>
          )}
        </div>

        <h2 className="mt-12 text-2xl font-semibold">Lessons</h2>
        {lessonList.length === 0 && (
          <p className="mt-4 text-white/50">No lessons yet.</p>
        )}

        <ol className="mt-6 space-y-6">
          {lessonList.map((lesson, index) => {
            const embed = youtubeEmbedUrl(lesson.youtube_url);
            return (
              <li key={lesson.id} className="rounded-2xl bg-white/5 p-6">
                <h3 className="text-lg font-semibold">
                  {index + 1}. {lesson.title}
                </h3>

                {enrolled ? (
                  <div className="mt-4 space-y-4">
                    {embed && (
                      <iframe
                        src={embed}
                        title={lesson.title}
                        className="aspect-video w-full rounded-lg"
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                      />
                    )}
                    {lesson.content && (
                      <p className="whitespace-pre-wrap text-white/80">
                        {lesson.content}
                      </p>
                    )}
                    {user && (
                      <LessonProgressButton
                        lessonId={lesson.id}
                        userId={user.id}
                        completed={completedIds.has(lesson.id)}
                      />
                    )}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-white/40">
                    Enroll to access this lesson.
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      </section>
    </main>
  );
}