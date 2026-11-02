"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SaveButton({
  courseId,
  userId,
  initialSaved,
  variant = "icon",
  onChange,
}: {
  courseId: string;
  userId: string | null;
  initialSaved: boolean;
  variant?: "icon" | "full";
  onChange?: (saved: boolean) => void;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (!userId) {
      router.push("/login");
      return;
    }
    if (busy) return;

    setBusy(true);
    const next = !saved;
    setSaved(next);
    onChange?.(next);

    const supabase = createClient();
    const { error } = next
      ? await supabase
          .from("saved_courses")
          .insert({ user_id: userId, course_id: courseId })
      : await supabase
          .from("saved_courses")
          .delete()
          .eq("user_id", userId)
          .eq("course_id", courseId);
    setBusy(false);

    if (error && error.code !== "23505") {
      setSaved(!next);
      onChange?.(!next);
    }
  }

  if (variant === "full") {
    return (
      <button
        onClick={toggle}
        className="rounded-lg border border-white/20 px-4 py-3 text-sm font-medium text-white/90 transition hover:bg-white/10"
      >
        {saved ? "♥ Saved" : "♡ Save"}
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      aria-label={saved ? "Remove from saved" : "Save course"}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-lg backdrop-blur transition hover:scale-110"
      style={{ color: saved ? "#ff6b81" : "#ffffff" }}
    >
      {saved ? "♥" : "♡"}
    </button>
  );
}