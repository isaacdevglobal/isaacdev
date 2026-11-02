"use client";

import Link from "next/link";
import SaveButton from "./SaveButton";
import StarRating from "./StarRating";
import {
  categoryGradient,
  categoryIcon,
  type CourseItem,
  type Progress,
} from "@/lib/courses";

export default function CourseCard({
  course,
  userId,
  saved,
  progress,
  onSavedChange,
}: {
  course: CourseItem;
  userId: string | null;
  saved: boolean;
  progress?: Progress;
  onSavedChange?: (saved: boolean) => void;
}) {
  const pct =
    progress && progress.total > 0
      ? Math.round((progress.done / progress.total) * 100)
      : 0;

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white/5 transition duration-200 hover:-translate-y-1 hover:bg-white/10 hover:shadow-xl hover:shadow-black/30">
      <Link href={`/courses/${course.slug}`} className="block">
        <div
          className="flex h-28 items-center justify-center text-5xl"
          style={{ background: categoryGradient(course.category) }}
        >
          <span
            aria-hidden
            className="inline-block transition-transform duration-200 group-hover:scale-125"
          >
            {categoryIcon(course.category)}
          </span>
        </div>

        <div className="p-5">
          <p className="text-xs uppercase tracking-wide text-white/50">
            {course.category ?? "General"} · {course.level}
          </p>
          <h3 className="mt-2 text-lg font-semibold">{course.title}</h3>
          {course.summary && (
            <p className="mt-2 line-clamp-2 text-sm text-white/70">
              {course.summary}
            </p>
          )}

          <div className="mt-4 flex items-center gap-2 text-sm">
            {course.review_count > 0 ? (
              <>
                <StarRating value={course.avg_rating} size={14} />
                <span className="text-white/60">
                  {course.avg_rating.toFixed(1)} ({course.review_count})
                </span>
              </>
            ) : (
              <span className="text-white/40">No reviews yet</span>
            )}
          </div>

          <div className="mt-4">
            {progress ? (
              <div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: "var(--learngth)" }}
                  />
                </div>
                <p className="mt-2 text-xs text-white/60">
                  {pct}% complete · Continue →
                </p>
              </div>
            ) : (
              <p
                className="text-sm font-medium"
                style={{ color: "var(--learngth)" }}
              >
                Start course →
              </p>
            )}
          </div>
        </div>
      </Link>

      <div className="absolute right-3 top-3">
        <SaveButton
          courseId={course.id}
          userId={userId}
          initialSaved={saved}
          onChange={onSavedChange}
        />
      </div>
    </div>
  );
}