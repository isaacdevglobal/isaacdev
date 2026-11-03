"use client";

import { useState } from "react";
import Link from "next/link";

export default function CertificateActions({
  code,
  courseTitle,
  issuedAt,
  status,
}: {
  code: string;
  courseTitle: string;
  issuedAt: string;
  status: string;
}) {
  const [copied, setCopied] = useState(false);

  function verifyUrl() {
    return `${window.location.origin}/verify/${code}`;
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(verifyUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available
    }
  }

  function addToLinkedIn() {
    const issued = new Date(issuedAt);
    const url = new URL("https://www.linkedin.com/profile/add");
    url.searchParams.set("startTask", "CERTIFICATION_NAME");
    url.searchParams.set("name", courseTitle);
    url.searchParams.set("organizationName", "IsaacDev Learngth");
    url.searchParams.set("issueYear", String(issued.getFullYear()));
    url.searchParams.set("issueMonth", String(issued.getMonth() + 1));
    url.searchParams.set("certUrl", verifyUrl());
    url.searchParams.set("certId", code);
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  }

  const btn =
    "rounded-lg border border-white/20 px-4 py-2 text-sm text-white/90 transition hover:bg-white/10";

  return (
    <div className="mt-4 flex flex-wrap gap-3">
      <Link href={`/verify/${code}`} className={btn}>
        View
      </Link>
      <button onClick={copyLink} className={btn}>
        {copied ? "✓ Link copied" : "Copy verification link"}
      </button>
      {status === "valid" && (
        <button onClick={addToLinkedIn} className={btn}>
          Add to LinkedIn
        </button>
      )}
    </div>
  );
}