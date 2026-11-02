import { redirect } from "next/navigation";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { createClient } from "@/lib/supabase/server";
import AdminCourseActions from "./AdminCourseActions";

type AdminCourse = {
  id: string;
  title: string;
  slug: string;
  status: string;
  instructor_id: string;
};

export default async function AdminCoursesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: adminRole } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin");

  if ((adminRole ?? []).length === 0) {
    redirect("/dashboard");
  }

  const { data } = await supabase
    .from("courses")
    .select("id, title, slug, status, instructor_id")
    .order("created_at", { ascending: false });
  const courses = (data ?? []) as AdminCourse[];

  const instructorIds = Array.from(new Set(courses.map((c) => c.instructor_id)));
  const names = new Map<string, string>();
  if (instructorIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, username")
      .in("id", instructorIds);
    (profiles ?? []).forEach((p) =>
      names.set(p.id, p.full_name || p.username || "Unnamed")
    );
  }

  const pending = courses.filter((c) => c.status === "pending_review");
  const others = courses.filter((c) => c.status !== "pending_review");

  function row(c: AdminCourse) {
    return (
      <div
        key={c.id}
        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/5 p-5"
      >
        <div>
          <Link
            href={`/courses/${c.slug}`}
            className="font-semibold hover:underline"
          >
            {c.title}
          </Link>
          <p className="text-xs text-white/50">
            by {names.get(c.instructor_id) ?? "Unknown"} · {c.status}
          </p>
        </div>
        <AdminCourseActions courseId={c.id} status={c.status} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-bg text-white">
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-6 pb-24">
        <h1 className="text-3xl font-bold">Course review</h1>

        <h2 className="mt-8 text-xl font-semibold">
          Waiting for review ({pending.length})
        </h2>
        <div className="mt-4 space-y-3">
          {pending.length === 0 && (
            <p className="text-sm text-white/50">Nothing waiting.</p>
          )}
          {pending.map(row)}
        </div>

        <h2 className="mt-10 text-xl font-semibold">All other courses</h2>
        <div className="mt-4 space-y-3">{others.map(row)}</div>
      </section>
    </main>
  );
}