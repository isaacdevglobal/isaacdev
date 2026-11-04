"use client";

import { useEffect, useState } from "react";

const PHRASES = [
  { text: "Learn it.", color: "#4da3ff" },
  { text: "Prove it.", color: "#55cc93" },
  { text: "Build it.", color: "#8b7cff" },
  { text: "Earn from it.", color: "#f2b544" },
];

export default function TypingHeadline({ className = "" }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const phrase = PHRASES[index];
  const length = phrase.text.length;

  useEffect(() => {
    let delay = deleting ? 35 : 80;
    if (!deleting && count === length) delay = 1400;
    if (deleting && count === 0) delay = 350;

    const id = setTimeout(() => {
      if (!deleting && count < length) {
        setCount(count + 1);
      } else if (!deleting) {
        setDeleting(true);
      } else if (count > 0) {
        setCount(count - 1);
      } else {
        setDeleting(false);
        setIndex((i) => (i + 1) % PHRASES.length);
      }
    }, delay);

    return () => clearTimeout(id);
  }, [count, deleting, length]);

  return (
    <h1 className={className}>
      <span className="sr-only">Learn it. Prove it. Build it. Earn from it.</span>

      <span aria-hidden="true" className="motion-reduce:hidden">
        <span style={{ color: phrase.color }}>{phrase.text.slice(0, count)}</span>
        <span className="caret" style={{ color: phrase.color }} />
      </span>

      <span aria-hidden="true" className="hidden motion-reduce:inline">
        Learn it. Prove it. Build it. <span className="text-mint">Earn from it.</span>
      </span>
    </h1>
  );
}