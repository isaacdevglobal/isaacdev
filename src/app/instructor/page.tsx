import { redirect } from "next/navigation";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { createClient } from "@/lib/supabase/server";

type MyCourse = { id: string; title: string; status: string };

const STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  pending_review: "Waiting for review",
  published: "Published",
  archived: "Archived",
};

export default async function InstructorPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "instructor");
  const isInstructor = (roles ?? []).length > 0;

  let courses: MyCourse[] = [];
  if (isInstructor) {
    const { data } = await supabase
      .from("courses")
      .select("id, title, status")
      .eq("instructor_id", user.id)
      .order("created_at", { ascending: false });
    courses = (data ?? []) as MyCourse[];
  }

  return (
    <main className="min-h-screen bg-bg text-white">
      <SiteHeader />

      <section className="mx-auto max-w-4xl px-6 pb-24">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Teach on Learngth</h1>
          {isInstructor && (
            <Link
              href="/instructor/new"
              className="rounded-lg px-5 py-3 font-semibold text-bg"
              style={{ background: "var(--learngth)" }}
            >
              + New course
            </Link>
          )}
        </div>

        {!isInstructor ? (
          <p className="mt-8 text-white/70">
            Instructor accounts are reviewed by our team. Applications will open
            soon.
          </p>
        ) : courses.length === 0 ? (
          <p className="mt-8 text-white/60">
            You have no courses yet. Create your first one.
          </p>
        ) : (
          <div className="mt-8 space-y-4">
            {courses.map((c) => (
              <Link
                key={c.id}
                href={`/instructor/${c.id}`}
                className="flex items-center justify-between rounded-2xl bg-white/5 p-5 transition hover:bg-white/10"
              >
                <span className="font-semibold">{c.title}</span>
                <span className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/70">
                  {STATUS_LABEL[c.status] ?? c.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}