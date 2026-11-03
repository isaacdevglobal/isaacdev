"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Initial = {
  title: string;
  description: string;
  project_url: string;
  repo_url: string;
  show_public: boolean;
};

export default function ProjectForm({
  courseId,
  userId,
  exists,
  locked,
  initial,
}: {
  courseId: string;
  userId: string;
  exists: boolean;
  locked: boolean;
  initial: Initial;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [projectUrl, setProjectUrl] = useState(initial.project_url);
  const [repoUrl, setRepoUrl] = useState(initial.repo_url);
  const [showPublic, setShowPublic] = useState(initial.show_public);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const field =
    "w-full rounded-lg bg-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-mint disabled:opacity-50";
  const isUrl = (v: string) => /^https?:\/\/\S+$/i.test(v);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!locked) {
      if (title.trim().length < 3) {
        setError("Please give your project a title.");
        return;
      }
      if (!isUrl(projectUrl.trim())) {
        setError("The project link must start with http:// or https://");
        return;
      }
      if (repoUrl.trim() && !isUrl(repoUrl.trim())) {
        setError("The code link must start with http:// or https://");
        return;
      }
    }

    setSaving(true);
    const supabase = createClient();
    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      project_url: projectUrl.trim(),
      repo_url: repoUrl.trim() || null,
      show_public: showPublic,
    };

    const { error } = exists
      ? await supabase
          .from("project_submissions")
          .update(payload)
          .eq("course_id", courseId)
          .eq("user_id", userId)
      : await supabase
          .from("project_submissions")
          .insert({ ...payload, course_id: courseId, user_id: userId });
    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage(exists ? "Saved." : "Project submitted for review.");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <input
        placeholder="Project title"
        value={title}
        disabled={locked}
        onChange={(e) => setTitle(e.target.value)}
        className={field}
      />
      <textarea
        rows={4}
        placeholder="Describe what you built and what you learned"
        value={description}
        disabled={locked}
        onChange={(e) => setDescription(e.target.value)}
        className={field}
      />
      <input
        placeholder="Link to your project (https://...)"
        value={projectUrl}
        disabled={locked}
        onChange={(e) => setProjectUrl(e.target.value)}
        className={field}
      />
      <input
        placeholder="Link to your code or source (optional)"
        value={repoUrl}
        disabled={locked}
        onChange={(e) => setRepoUrl(e.target.value)}
        className={field}
      />

      <label className="flex items-start gap-3 text-sm text-white/80">
        <input
          type="checkbox"
          checked={showPublic}
          onChange={(e) => setShowPublic(e.target.checked)}
          className="mt-1"
        />
        <span>
          Show this project on my public certificate page, so employers can see
          my work.
        </span>
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {message && <p className="text-sm text-mint">{message}</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded-lg px-6 py-3 font-semibold text-bg disabled:opacity-60"
        style={{ background: "var(--learngth)" }}
      >
        {saving
          ? "Saving..."
          : locked
          ? "Save visibility"
          : exists
          ? "Update and resubmit"
          : "Submit project"}
      </button>
    </form>
  );
}