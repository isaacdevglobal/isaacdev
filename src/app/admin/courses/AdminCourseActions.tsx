"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminCourseActions({
  courseId,
  status,
}: {
  courseId: string;
  status: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function setStatus(next: string) {
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase
      .from("courses")
      .update({ status: next })
      .eq("id", courseId);
    setBusy(false);

    if (error) {
      setError(error.message);
      return;
    }
    router.refresh();
  }

  const btn = "rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-50";

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex gap-2">
        {status !== "published" && (
          <button
            disabled={busy}
            onClick={() => setStatus("published")}
            className={`${btn} bg-mint text-bg`}
          >
            Approve
          </button>
        )}
        {status === "pending_review" && (
          <button
            disabled={busy}
            onClick={() => setStatus("draft")}
            className={`${btn} border border-white/20 text-white/80`}
          >
            Send back
          </button>
        )}
        {status === "published" && (
          <button
            disabled={busy}
            onClick={() => setStatus("archived")}
            className={`${btn} border border-white/20 text-white/80`}
          >
            Archive
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}