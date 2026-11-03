import { redirect } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import { createClient } from "@/lib/supabase/server";
import GradeForm from "./GradeForm";

type Sub = {
  id: string;
  course_id: string;
  user_id: string;
  title: string;
  description: string | null;
  project_url: string;
  repo_url: string | null;
  status: string;
  score: number | null;
  feedback: string | null;
};

export default async function ReviewPage() {
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
    .in("role", ["instructor", "admin"]);

  if ((roles ?? []).length === 0) {
    redirect("/dashboard");
  }

  const { data } = await supabase
    .from("project_submissions")
    .select(
      "id, course_id, user_id, title, description, project_url, repo_url, status, score, feedback"
    )
    .neq("user_id", user.id)
    .order("created_at", { ascending: false });
  const subs = (data ?? []) as Sub[];

  const courseIds = Array.from(new Set(subs.map((s) => s.course_id)));
  const userIds = Array.from(new Set(subs.map((s) => s.user_id)));

  const courses = new Map<string, { title: string; pass_mark: number }>();
  if (courseIds.length > 0) {
    const { data: cs } = await supabase
      .from("courses")
      .select("id, title, pass_mark")
      .in("id", courseIds);
    (cs ?? []).forEach((c) =>
      courses.set(c.id, { title: c.title, pass_mark: Number(c.pass_mark) })
    );
  }

  const names = new Map<string, string>();
  if (userIds.length > 0) {
    const { data: ps } = await supabase
      .from("profiles")
      .select("id, full_name, username")
      .in("id", userIds);
    (ps ?? []).forEach((p) =>
      names.set(p.id, p.full_name || p.username || "Learner")
    );
  }

  const waiting = subs.filter((s) => s.status === "submitted");
  const graded = subs.filter((s) => s.status === "graded");

  function card(s: Sub) {
    const course = courses.get(s.course_id);
    return (
      <div key={s.id} className="rounded-2xl bg-white/5 p-6">
        <p className="text-xs uppercase tracking-wide text-white/50">
          {course?.title ?? "Course"} · {names.get(s.user_id) ?? "Learner"}
        </p>
        <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
        {s.description && (
          <p className="mt-2 whitespace-pre-wrap text-sm text-white/70">
            {s.description}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-4 text-sm">
          <a
            href={s.project_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-mint hover:underline"
          >
            Open project ↗
          </a>
          {s.repo_url && (
            <a
              href={s.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-mint hover:underline"
            >
              View code ↗
            </a>
          )}
        </div>
        <GradeForm
          key={`${s.id}-${s.score}`}
          submissionId={s.id}
          initialScore={s.score}
          initialFeedback={s.feedback ?? ""}
          passMark={course?.pass_mark ?? 70}
        />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-bg text-white">
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-6 pb-24">
        <h1 className="text-3xl font-bold">Project reviews</h1>

        <h2 className="mt-8 text-xl font-semibold">
          Waiting for review ({waiting.length})
        </h2>
        <div className="mt-4 space-y-4">
          {waiting.length === 0 && (
            <p className="text-sm text-white/50">No projects waiting.</p>
          )}
          {waiting.map(card)}
        </div>

        <h2 className="mt-10 text-xl font-semibold">Already graded</h2>
        <div className="mt-4 space-y-4">{graded.map(card)}</div>
      </section>
    </main>
  );
}