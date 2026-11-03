import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { createClient } from "@/lib/supabase/server";
import CourseEditor from "./CourseEditor";
import ProjectSettings from "./ProjectSettings";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: course } = await supabase
    .from("courses")
    .select(
      "id, title, slug, summary, description, category, level, status, project_brief, pass_mark"
    )
    .eq("id", id)
    .eq("instructor_id", user.id)
    .maybeSingle();

  if (!course) {
    notFound();
  }

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, title, position, youtube_url, content")
    .eq("course_id", course.id)
    .order("position", { ascending: true });

  return (
    <main className="min-h-screen bg-bg text-white">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-6 pb-24">
        <Link href="/instructor" className="text-sm text-white/50 hover:text-white">
          ← My courses
        </Link>
        <CourseEditor course={course} lessons={lessons ?? []} />
        <ProjectSettings
          courseId={course.id}
          initialBrief={course.project_brief ?? ""}
          initialPassMark={Number(course.pass_mark)}
        />
      </section>
    </main>
  );
}