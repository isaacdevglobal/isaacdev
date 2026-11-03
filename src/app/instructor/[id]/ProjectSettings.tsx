"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ProjectSettings({
  courseId,
  initialBrief,
  initialPassMark,
}: {
  courseId: string;
  initialBrief: string;
  initialPassMark: number;
}) {
  const router = useRouter();
  const [brief, setBrief] = useState(initialBrief);
  const [passMark, setPassMark] = useState(String(initialPassMark));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const n = Number(passMark);
    if (!Number.isInteger(n) || n < 1 || n > 100) {
      setError("Pass mark must be a whole number from 1 to 100.");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("courses")
      .update({ project_brief: brief.trim() || null, pass_mark: n })
      .eq("id", courseId);
    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }
    setMessage("Project settings saved.");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-4 rounded-2xl bg-white/5 p-6">
      <h2 className="text-xl font-semibold">Final project</h2>
      <p className="text-sm text-white/60">
        Learners must submit this project and reach the pass mark to earn a
        certificate. Leave the brief empty for a course with no project.
      </p>
      <textarea
        rows={5}
        value={brief}
        onChange={(e) => setBrief(e.target.value)}
        placeholder="Describe the project learners must complete and what you will look for"
        className="w-full rounded-lg bg-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-mint"
      />
      <div className="flex items-center gap-3">
        <label className="text-sm text-white/70" htmlFor="passmark">
          Pass mark (%)
        </label>
        <input
          id="passmark"
          type="number"
          min={1}
          max={100}
          value={passMark}
          onChange={(e) => setPassMark(e.target.value)}
          className="w-24 rounded-lg bg-white/10 px-4 py-2 outline-none focus:ring-2 focus:ring-mint"
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {message && <p className="text-sm text-mint">{message}</p>}
      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-mint px-5 py-2 font-semibold text-bg disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save project settings"}
      </button>
    </form>
  );
}