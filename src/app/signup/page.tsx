"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (data.session) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setInfo("Check your email to confirm your account, then log in.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-6 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-2xl bg-white/5 p-8"
      >
        <h1 className="text-2xl font-bold">
          Join <span className="text-ash">Isaac</span>
          <span className="text-mint">Dev</span>
        </h1>

        <input
          type="text"
          required
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded-lg bg-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-mint"
        />
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg bg-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-mint"
        />
        <input
          type="password"
          required
          placeholder="Password (8+ characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg bg-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-mint"
        />

        {error && <p className="text-sm text-red-400">{error}</p>}
        {info && <p className="text-sm text-mint">{info}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-mint py-3 font-semibold text-bg disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="text-center text-sm text-white/60">
          Already have an account?{" "}
          <Link href="/login" className="text-mint hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
}