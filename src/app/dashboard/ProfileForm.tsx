"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  userId: string;
  initialFullName: string;
  initialUsername: string;
  initialBio: string;
};

export default function ProfileForm({
  userId,
  initialFullName,
  initialUsername,
  initialBio,
}: Props) {
  const [fullName, setFullName] = useState(initialFullName);
  const [username, setUsername] = useState(initialUsername);
  const [bio, setBio] = useState(initialBio);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const cleanUsername = username.trim().toLowerCase();
    if (cleanUsername && !/^[a-z0-9_]{3,30}$/.test(cleanUsername)) {
      setError(
        "Username must be 3-30 characters: lowercase letters, numbers or underscores."
      );
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim() || null,
        username: cleanUsername || null,
        bio: bio.trim() || null,
      })
      .eq("id", userId);
    setSaving(false);

    if (error) {
      if (error.code === "23505") {
        setError("That username is already taken.");
      } else {
        setError(error.message);
      }
      return;
    }

    setUsername(cleanUsername);
    setMessage("Profile saved.");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Full name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="w-full rounded-lg bg-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-mint"
      />
      <input
        type="text"
        placeholder="Username (e.g. isaac_dev)"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full rounded-lg bg-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-mint"
      />
      <textarea
        placeholder="Short bio"
        rows={4}
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        className="w-full rounded-lg bg-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-mint"
      />

      {error && <p className="text-sm text-red-400">{error}</p>}
      {message && <p className="text-sm text-mint">{message}</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-mint px-6 py-3 font-semibold text-bg disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}