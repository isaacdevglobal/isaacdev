"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { youtubeEmbedUrl } from "@/lib/youtube";

type Course = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  description: string | null;
  category: string | null;
  level: string;
  status: string;
};

type Lesson = {
  id: string;
  title: string;
  position: number;
  youtube_url: string | null;
  content: string | null;
};

const STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  pending_review: "Waiting for review",
  published: "Published",
  archived: "Archived",
};

export default function CourseEditor({
  course,
  lessons,
}: {
  course: Course;
  lessons: Lesson[];
}) {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState(course.title);
  const [summary, setSummary] = useState(course.summary ?? "");
  const [category, setCategory] = useState(course.category ?? "");
  const [level, setLevel] = useState(course.level);
  const [description, setDescription] = useState(course.description ?? "");

  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonUrl, setLessonUrl] = useState("");
  const [lessonContent, setLessonContent] = useState("");

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const field =
    "w-full rounded-lg bg-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-mint";

  async function saveDetails(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setBusy(true);

    const { error } = await supabase
      .from("courses")
      .update({
        title: title.trim(),
        summary: summary.trim() || null,
        category: category.trim() || null,
        level,
        description: description.trim() || null,
      })
      .eq("id", course.id);
    setBusy(false);

    if (error) {
      setError(error.message);
      return;
    }
    setMessage("Course details saved.");
    router.refresh();
  }

  async function addLesson(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (lessonTitle.trim().length < 2) {
      setError("Please enter a lesson title.");
      return;
    }
    if (lessonUrl.trim() && !youtubeEmbedUrl(lessonUrl.trim())) {
      setError("That does not look like a valid YouTube link.");
      return;
    }

    setBusy(true);
    const position =
      lessons.length > 0 ? Math.max(...lessons.map((l) => l.position)) + 1 : 1;

    const { error } = await supabase.from("lessons").insert({
      course_id: course.id,
      title: lessonTitle.trim(),
      position,
      youtube_url: lessonUrl.trim() || null,
      content: lessonContent.trim() || null,
    });
    setBusy(false);

    if (error) {
      setError(error.message);
      return;
    }

    setLessonTitle("");
    setLessonUrl("");
    setLessonContent("");
    setMessage("Lesson added.");
    router.refresh();
  }

  async function deleteLesson(id: string) {
    if (!window.confirm("Delete this lesson?")) return;
    setError(null);
    const { error } = await supabase.from("lessons").delete().eq("id", id);
    if (error) {
      setError(error.message);
      return;
    }
    router.refresh();
  }

  async function submitForReview() {
    setError(null);
    setMessage(null);
    setBusy(true);
    const { error } = await supabase
      .from("courses")
      .update({ status: "pending_review" })
      .eq("id", course.id);
    setBusy(false);

    if (error) {
      setError(error.message);
      return;
    }
    setMessage("Submitted. An admin will review your course.");
    router.refresh();
  }

  return (
    <div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <span className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/70">
          {STATUS_LABEL[course.status] ?? course.status}
        </span>
      </div>

      {course.status === "draft" && (
        <div className="mt-4 rounded-2xl bg-white/5 p-5">
          <p className="text-sm text-white/70">
            When your course is ready (add at least one lesson), submit it for
            review.
          </p>
          <button
            onClick={submitForReview}
            disabled={busy || lessons.length === 0}
            className="mt-3 rounded-lg px-5 py-2 font-semibold text-bg disabled:opacity-50"
            style={{ background: "var(--learngth)" }}
          >
            Submit for review
          </button>
        </div>
      )}

      {course.status === "published" && (
        <p className="mt-4 text-sm">
          Live:{" "}
          <Link
            href={`/courses/${course.slug}`}
            className="text-mint hover:underline"
          >
            view course page
          </Link>
        </p>
      )}

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      {message && <p className="mt-4 text-sm text-mint">{message}</p>}

      <form onSubmit={saveDetails} className="mt-8 space-y-4 rounded-2xl bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Course details</h2>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className={field}
        />
        <input
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="One-line summary"
          className={field}
        />
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          className={field}
        />
        <select value={level} onChange={(e) => setLevel(e.target.value)} className={field}>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <textarea
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className={field}
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-mint px-5 py-2 font-semibold text-bg disabled:opacity-60"
        >
          Save details
        </button>
      </form>

      <h2 className="mt-10 text-xl font-semibold">Lessons</h2>
      <div className="mt-4 space-y-3">
        {lessons.length === 0 && (
          <p className="text-sm text-white/50">No lessons yet.</p>
        )}
        {lessons.map((l, i) => (
          <div
            key={l.id}
            className="flex items-center justify-between rounded-xl bg-white/5 p-4"
          >
            <div>
              <p className="font-medium">
                {i + 1}. {l.title}
              </p>
              {l.youtube_url && (
                <p className="text-xs text-white/40">{l.youtube_url}</p>
              )}
            </div>
            <button
              onClick={() => deleteLesson(l.id)}
              className="text-sm text-red-400 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={addLesson} className="mt-6 space-y-4 rounded-2xl bg-white/5 p-6">
        <h3 className="text-lg font-semibold">Add a lesson</h3>
        <input
          value={lessonTitle}
          onChange={(e) => setLessonTitle(e.target.value)}
          placeholder="Lesson title"
          className={field}
        />
        <input
          value={lessonUrl}
          onChange={(e) => setLessonUrl(e.target.value)}
          placeholder="YouTube link (optional)"
          className={field}
        />
        <textarea
          rows={4}
          value={lessonContent}
          onChange={(e) => setLessonContent(e.target.value)}
          placeholder="Lesson notes or instructions (optional)"
          className={field}
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-mint px-5 py-2 font-semibold text-bg disabled:opacity-60"
        >
          Add lesson
        </button>
      </form>
    </div>
  );
}