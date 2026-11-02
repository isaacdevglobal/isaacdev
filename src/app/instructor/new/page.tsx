"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export default function NewCoursePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("beginner");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (title.trim().length < 3) {
      setError("Please enter a course title.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      router.push("/login");
      return;
    }

    const slug = `${slugify(title) || "course"}-${Math.random()
      .toString(36)
      .slice(2, 6)}`;

    const { data, error } = await supabase
      .from("courses")
      .insert({
        instructor_id: user.id,
        title: title.trim(),
        slug,
        summary: summary.trim() || null,
        category: category.trim() || null,
        level,
        description: description.trim() || null,
      })
      .select("id")
      .single();
    setLoading(false);

    if (error || !data) {
      setError(error?.message ?? "Could not create the course.");
      return;
    }

    router.push(`/instructor/${data.id}`);
  }

  const field =
    "w-full rounded-lg bg-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-mint";

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-6 py-12 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl space-y-4 rounded-2xl bg-white/5 p-8"
      >
        <h1 className="text-2xl font-bold">Create a course</h1>

        <input
          required
          placeholder="Course title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={field}
        />
        <input
          placeholder="One-line summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className={field}
        />
        <input
          placeholder="Category (e.g. Development, AI, Thinking)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={field}
        />
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className={field}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <textarea
          rows={5}
          placeholder="What will learners get from this course?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={field}
        />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg py-3 font-semibold text-bg disabled:opacity-60"
          style={{ background: "var(--learngth)" }}
        >
          {loading ? "Creating..." : "Create course"}
        </button>
      </form>
    </main>
  );
}