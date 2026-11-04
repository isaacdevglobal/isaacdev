"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/lib/products";

export default function WaitlistForm({
  product,
  color,
  label,
}: {
  product: Product["slug"];
  color: string;
  label: string;
}) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (website) {
      setDone(true);
      return;
    }

    const clean = email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clean)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("waitlist")
      .insert({ email: clean, product });
    setLoading(false);

    if (error && error.code !== "23505") {
      setError("Something went wrong. Please try again.");
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <p className="rounded-xl bg-white/10 px-5 py-4 text-sm" style={{ color }}>
        ✓ You&apos;re on the list. We&apos;ll email you when it opens.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-w-0 flex-1 rounded-xl bg-white/10 px-5 py-3 outline-none focus:ring-2"
          style={{ ["--tw-ring-color" as string]: color }}
        />
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="hidden"
          aria-hidden
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl px-6 py-3 font-semibold text-bg transition hover:brightness-110 disabled:opacity-60"
          style={{ background: color }}
        >
          {loading ? "Joining..." : label}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </form>
  );
}