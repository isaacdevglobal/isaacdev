"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LessonProgressButton({
  lessonId,
  userId,
  completed,
}: {
  lessonId: string;
  userId: string;
  completed: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = completed
      ? await supabase
          .from("lesson_progress")
          .delete()
          .eq("user_id", userId)
          .eq("lesson_id", lessonId)
      : await supabase
          .from("lesson_progress")
          .insert({ user_id: userId, lesson_id: lessonId });
    setLoading(false);

    if (error && error.code !== "23505") {
      setError(error.message);
      return;
    }

    router.refresh();
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className={
          completed
            ? "rounded-lg border border-mint px-4 py-2 text-sm text-mint disabled:opacity-60"
            : "rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20 disabled:opacity-60"
        }
      >
        {completed ? "Completed (click to undo)" : "Mark as complete"}
      </button>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}