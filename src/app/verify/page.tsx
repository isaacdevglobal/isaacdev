"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import VerifiedStar from "@/components/VerifiedStar";

export default function VerifyIndexPage() {
  const router = useRouter();
  const [code, setCode] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const clean = code.trim().toUpperCase();
    if (clean) {
      router.push(`/verify/${encodeURIComponent(clean)}`);
    }
  }

  return (
    <main className="min-h-screen bg-bg text-white">
      <SiteHeader />
      <section className="mx-auto max-w-xl px-6 py-20 text-center">
        <div className="flex justify-center">
          <VerifiedStar size={56} />
        </div>
        <h1 className="mt-6 text-4xl font-bold">Verify a certificate</h1>
        <p className="mt-3 text-white/60">
          Enter the certificate ID to check that it is real and still valid.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            required
            placeholder="IDV-2026-XXXXXXXXXX"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="min-w-0 flex-1 rounded-xl bg-white/10 px-5 py-3 font-mono outline-none focus:ring-2 focus:ring-mint"
          />
          <button
            type="submit"
            className="rounded-xl bg-mint px-6 py-3 font-semibold text-bg"
          >
            Verify
          </button>
        </form>
      </section>
    </main>
  );
}