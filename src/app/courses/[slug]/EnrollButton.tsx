"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function EnrollButton({
  courseId,
  userId,
}: {
  courseId: string;
  userId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleEnroll() {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase
      .from("enrollments")
      .insert({ user_id: userId, course_id: courseId });
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
        onClick={handleEnroll}
        disabled={loading}
        className="rounded-lg px-6 py-3 font-semibold text-bg disabled:opacity-60"
        style={{ background: "var(--learngth)" }}
      >
        {loading ? "Enrolling..." : "Enroll for free"}
      </button>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}