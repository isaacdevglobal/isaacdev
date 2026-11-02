"use client";

import { useState } from "react";

export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // Share sheet closed; fall back to copying the link
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available
    }
  }

  return (
    <button
      onClick={handleShare}
      className="rounded-lg border border-white/20 px-4 py-3 text-sm font-medium text-white/90 transition hover:bg-white/10"
    >
      {copied ? "✓ Link copied" : "↗ Share"}
    </button>
  );
}