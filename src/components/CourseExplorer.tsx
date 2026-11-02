"use client";

import { useMemo, useState } from "react";
import CourseCard from "./CourseCard";
import type { CourseItem, Progress } from "@/lib/courses";

const LEVELS = ["All", "beginner", "intermediate", "advanced"];

export default function CourseExplorer({
  courses,
  userId,
  savedIds,
  progress,
}: {
  courses: CourseItem[];
  userId: string | null;
  savedIds: string[];
  progress: Record<string, Progress>;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");
  const [savedOnly, setSavedOnly] = useState(false);
  const [saved, setSaved] = useState<Set<string>>(new Set(savedIds));

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(new Set(courses.map((c) => c.category ?? "General"))),
    ],
    [courses]
  );

  const filtering =
    query.trim() !== "" || category !== "All" || level !== "All" || savedOnly;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter((c) => {
      if (category !== "All" && (c.category ?? "General") !== category)
        return false;
      if (level !== "All" && c.level !== level) return false;
      if (savedOnly && !saved.has(c.id)) return false;
      if (q) {
        const text = `${c.title} ${c.summary ?? ""} ${c.category ?? ""}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [courses, query, category, level, savedOnly, saved]);

  const groups = useMemo(() => {
    const map = new Map<string, CourseItem[]>();
    for (const c of courses) {
      const key = c.category ?? "General";
      map.set(key, [...(map.get(key) ?? []), c]);
    }
    return Array.from(map.entries());
  }, [courses]);

  const inProgress = courses.filter((c) => progress[c.id]);

  function handleSavedChange(id: string, isSaved: boolean) {
    setSaved((prev) => {
      const next = new Set(prev);
      if (isSaved) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function card(c: CourseItem) {
    return (
      <CourseCard
        key={c.id}
        course={c}
        userId={userId}
        saved={saved.has(c.id)}
        progress={progress[c.id]}
        onSavedChange={(v) => handleSavedChange(c.id, v)}
      />
    );
  }

  function chip(active: boolean) {
    return `rounded-full px-4 py-2 text-sm transition ${
      active
        ? "font-semibold text-bg"
        : "bg-white/10 text-white/70 hover:bg-white/20"
    }`;
  }

  return (
    <div>
      <input
        type="search"
        placeholder="Search courses..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-xl bg-white/10 px-5 py-4 outline-none focus:ring-2"
        style={{ ["--tw-ring-color" as string]: "var(--learngth)" }}
      />

      <div className="mt-5 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={chip(category === c)}
            style={category === c ? { background: "var(--learngth)" } : undefined}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {LEVELS.map((l) => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            className={chip(level === l)}
            style={level === l ? { background: "var(--learngth)" } : undefined}
          >
            {l === "All" ? "Any level" : l}
          </button>
        ))}
        <button
          onClick={() => setSavedOnly((v) => !v)}
          className={chip(savedOnly)}
          style={savedOnly ? { background: "#ff6b81" } : undefined}
        >
          ♥ Saved
        </button>
      </div>

      {filtering ? (
        <div className="mt-10">
          <h2 className="mb-6 text-xl font-semibold">
            {filtered.length} {filtered.length === 1 ? "course" : "courses"}{" "}
            found
          </h2>
          {filtered.length === 0 ? (
            <p className="text-white/50">
              Nothing matches yet. Try a different search or filter.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map(card)}
            </div>
          )}
        </div>
      ) : (
        <>
          {inProgress.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-6 text-2xl font-semibold">Continue learning</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {inProgress.map(card)}
              </div>
            </section>
          )}

          {groups.map(([name, list]) => (
            <section key={name} className="mt-12">
              <h2 className="mb-6 text-2xl font-semibold">
                {name}{" "}
                <span className="text-base font-normal text-white/40">
                  {list.length} {list.length === 1 ? "course" : "courses"}
                </span>
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {list.map(card)}
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  );
}