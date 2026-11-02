import { notFound } from "next/navigation";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import StarRating from "@/components/StarRating";
import SaveButton from "@/components/SaveButton";
import ShareButton from "@/components/ShareButton";
import { createClient } from "@/lib/supabase/server";
import { youtubeEmbedUrl } from "@/lib/youtube";
import { categoryGradient, categoryIcon } from "@/lib/courses";
import EnrollButton from "./EnrollButton";
import LessonProgressButton from "./LessonProgressButton";
import ReviewForm from "./ReviewForm";

type ReviewProfile = { full_name: string | null; username: string | null };
type ReviewRow = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user_id: string;
  profiles: ReviewProfile | ReviewProfile[] | null;
};

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
  let saved = false;
  const completedIds = new Set<string>();

  if (user) {
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", course.id)
      .maybeSingle();
    enrolled = !!enrollment;

    const { data: savedRow } = await supabase
      .from("saved_courses")
      .select("course_id")
      .eq("user_id", user.id)
      .eq("course_id", course.id)
      .maybeSingle();
    saved = !!savedRow;

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

  const { data: reviewData } = await supabase
    .from("course_reviews")
    .select("id, rating, comment, created_at, user_id, profiles(full_name, username)")
    .eq("course_id", course.id)
    .order("created_at", { ascending: false });
  const reviews = (reviewData ?? []) as unknown as ReviewRow[];

  const reviewCount = reviews.length;
  const avg =
    reviewCount > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : 0;
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));
  const myReview = user ? reviews.find((r) => r.user_id === user.id) : undefined;

  const total = lessonList.length;
  const done = completedIds.size;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const nextLesson = lessonList.find((l) => !completedIds.has(l.id));

  return (
    <main className="min-h-screen bg-bg text-white">
      <SiteHeader />

      <section className="mx-auto max-w-4xl px-6 pb-24">
        <Link href="/courses" className="text-sm text-white/50 hover:text-white">
          ← All courses
        </Link>

        <div
          className="mt-4 rounded-3xl p-8 sm:p-10"
          style={{ background: categoryGradient(course.category) }}
        >
          <div className="text-5xl">{categoryIcon(course.category)}</div>
          <p className="mt-4 text-xs uppercase tracking-wide text-white/70">
            {course.category ?? "General"} · {course.level}
            {course.status !== "published" && ` · ${course.status}`}
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{course.title}</h1>
          {course.summary && (
            <p className="mt-3 max-w-2xl text-lg text-white/80">
              {course.summary}
            </p>
          )}
          <div className="mt-4 flex items-center gap-2 text-sm">
            {reviewCount > 0 ? (
              <>
                <StarRating value={avg} />
                <span className="text-white/80">
                  {avg.toFixed(1)} · {reviewCount}{" "}
                  {reviewCount === 1 ? "review" : "reviews"}
                </span>
              </>
            ) : (
              <span className="text-white/70">No reviews yet</span>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-start gap-3">
          {!user && (
            <Link
              href="/signup"
              className="rounded-lg px-6 py-3 font-semibold text-bg"
              style={{ background: "var(--learngth)" }}
            >
              ▶ Sign up to start
            </Link>
          )}
          {user && !enrolled && (
            <EnrollButton courseId={course.id} userId={user.id} />
          )}
          {user && enrolled && nextLesson && (
            <a
              href={`#lesson-${nextLesson.id}`}
              className="rounded-lg px-6 py-3 font-semibold text-bg"
              style={{ background: "var(--learngth)" }}
            >
              {done === 0 ? "▶ Start learning" : "▶ Continue learning"}
            </a>
          )}
          {user && enrolled && !nextLesson && total > 0 && (
            <a
              href="#reviews"
              className="rounded-lg px-6 py-3 font-semibold text-bg"
              style={{ background: "var(--learngth)" }}
            >
              🎉 All lessons done. Leave a review
            </a>
          )}
          <SaveButton
            courseId={course.id}
            userId={user?.id ?? null}
            initialSaved={saved}
            variant="full"
          />
          <ShareButton title={course.title} />
        </div>

        {enrolled && total > 0 && (
          <div className="mt-6">
            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, background: "var(--learngth)" }}
              />
            </div>
            <p className="mt-2 text-sm text-white/60">
              {done} of {total} lessons completed ({pct}%)
            </p>
          </div>
        )}

        {course.description && (
          <p className="mt-10 whitespace-pre-wrap text-white/80">
            {course.description}
          </p>
        )}

        <h2 className="mt-12 text-2xl font-semibold">Lessons</h2>
        {lessonList.length === 0 && (
          <p className="mt-4 text-white/50">No lessons yet.</p>
        )}

        <ol className="mt-6 space-y-6">
          {lessonList.map((lesson, index) => {
            const embed = youtubeEmbedUrl(lesson.youtube_url);
            const isDone = completedIds.has(lesson.id);
            return (
              <li
                key={lesson.id}
                id={`lesson-${lesson.id}`}
                className="scroll-mt-24 rounded-2xl bg-white/5 p-6"
              >
                <h3 className="text-lg font-semibold">
                  {isDone ? "✅ " : ""}
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
                        completed={isDone}
                      />
                    )}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-white/40">
                    🔒 Start the course to unlock this lesson.
                  </p>
                )}
              </li>
            );
          })}
        </ol>

        <h2 id="reviews" className="mt-16 scroll-mt-24 text-2xl font-semibold">
          Reviews
        </h2>

        <div className="mt-6 grid gap-6 sm:grid-cols-[200px_1fr]">
          <div className="rounded-2xl bg-white/5 p-6 text-center">
            <p className="text-5xl font-bold">
              {reviewCount > 0 ? avg.toFixed(1) : "–"}
            </p>
            <div className="mt-2">
              <StarRating value={avg} size={20} />
            </div>
            <p className="mt-2 text-sm text-white/50">
              {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
            </p>
          </div>

          <div className="space-y-2 rounded-2xl bg-white/5 p-6">
            {distribution.map((d) => (
              <div key={d.star} className="flex items-center gap-3 text-sm">
                <span className="w-10 text-white/60">{d.star} ★</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${reviewCount > 0 ? (d.count / reviewCount) * 100 : 0}%`,
                      background: "#f2b544",
                    }}
                  />
                </div>
                <span className="w-6 text-right text-white/50">{d.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          {user && enrolled && (
            <ReviewForm
              key={myReview?.id ?? "new"}
              courseId={course.id}
              userId={user.id}
              initialRating={myReview?.rating ?? 0}
              initialComment={myReview?.comment ?? ""}
            />
          )}
          {user && !enrolled && (
            <p className="text-sm text-white/50">
              Start this course to leave a review.
            </p>
          )}
          {!user && (
            <p className="text-sm text-white/50">
              <Link href="/login" className="text-mint hover:underline">
                Log in
              </Link>{" "}
              and start the course to leave a review.
            </p>
          )}
        </div>

        <div className="mt-8 space-y-4">
          {reviews.map((r) => {
            const p = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;
            const name = p?.full_name || p?.username || "Learner";
            return (
              <div key={r.id} className="rounded-2xl bg-white/5 p-5">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full font-semibold text-bg"
                    style={{ background: "var(--learngth)" }}
                  >
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{name}</p>
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <StarRating value={r.rating} size={13} />
                      <span>
                        {new Date(r.created_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                {r.comment && (
                  <p className="mt-3 whitespace-pre-wrap text-white/80">
                    {r.comment}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}