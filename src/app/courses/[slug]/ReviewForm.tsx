"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ReviewForm({
  courseId,
  userId,
  initialRating,
  initialComment,
}: {
  courseId: string;
  userId: string;
  initialRating: number;
  initialComment: string;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState(initialComment);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasReview = initialRating > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (rating < 1) {
      setError("Please choose a star rating.");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("course_reviews").upsert(
      {
        course_id: courseId,
        user_id: userId,
        rating,
        comment: comment.trim() || null,
      },
      { onConflict: "course_id,user_id" }
    );
    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Thanks! Your review is live.");
    router.refresh();
  }

  async function handleDelete() {
    setError(null);
    setMessage(null);
    const supabase = createClient();
    const { error } = await supabase
      .from("course_reviews")
      .delete()
      .eq("course_id", courseId)
      .eq("user_id", userId);

    if (error) {
      setError(error.message);
      return;
    }

    setRating(0);
    setComment("");
    router.refresh();
  }

  const shown = hover || rating;

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white/5 p-6">
      <h3 className="text-lg font-semibold">
        {hasReview ? "Your review" : "Rate this course"}
      </h3>

      <div className="mt-3 flex gap-1" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onMouseEnter={() => setHover(n)}
            onClick={() => setRating(n)}
            className="text-3xl transition hover:scale-125"
            style={{ color: n <= shown ? "#f2b544" : "rgba(255,255,255,0.2)" }}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        placeholder="Tell others what you thought (optional)"
        rows={3}
        maxLength={1000}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="mt-4 w-full rounded-lg bg-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-mint"
      />

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      {message && <p className="mt-2 text-sm text-mint">{message}</p>}

      <div className="mt-4 flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg px-5 py-2 font-semibold text-bg disabled:opacity-60"
          style={{ background: "var(--learngth)" }}
        >
          {saving ? "Saving..." : hasReview ? "Update review" : "Post review"}
        </button>
        {hasReview && (
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg border border-white/20 px-5 py-2 text-sm text-white/70 hover:text-white"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}