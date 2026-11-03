"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function GradeForm({
  submissionId,
  initialScore,
  initialFeedback,
  passMark,
}: {
  submissionId: string;
  initialScore: number | null;
  initialFeedback: string;
  passMark: number;
}) {
  const router = useRouter();
  const [score, setScore] = useState(
    initialScore === null ? "" : String(initialScore)
  );
  const [feedback, setFeedback] = useState(initialFeedback);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const n = Number(score);
    if (score.trim() === "" || !Number.isInteger(n) || n < 0 || n > 100) {
      setError("Enter a whole number score from 0 to 100.");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("project_submissions")
      .update({ score: n, feedback: feedback.trim() || null })
      .eq("id", submissionId);
    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage(
      n >= passMark
        ? "Graded. A certificate has been issued."
        : "Graded. The learner can improve and resubmit."
    );
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <div className="flex items-center gap-3">
        <input
          type="number"
          min={0}
          max={100}
          placeholder="Score"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          className="w-28 rounded-lg bg-white/10 px-4 py-2 outline-none focus:ring-2 focus:ring-mint"
        />
        <span className="text-sm text-white/50">Pass mark: {passMark}%</span>
      </div>
      <textarea
        rows={3}
        placeholder="Feedback for the learner"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        className="w-full rounded-lg bg-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-mint"
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
      {message && <p className="text-sm text-mint">{message}</p>}
      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-mint px-5 py-2 font-semibold text-bg disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save grade"}
      </button>
    </form>
  );
}