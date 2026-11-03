import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProjectForm from "./ProjectForm";

type Submission = {
  title: string;
  description: string | null;
  project_url: string;
  repo_url: string | null;
  show_public: boolean;
  status: string;
  score: number | null;
  feedback: string | null;
};

export default async function ProjectSection({
  courseId,
  userId,
  enrolled,
  allDone,
}: {
  courseId: string;
  userId: string | null;
  enrolled: boolean;
  allDone: boolean;
}) {
  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("project_brief, pass_mark")
    .eq("id", courseId)
    .maybeSingle();

  if (!course || !course.project_brief) {
    return null;
  }

  const passMark = Number(course.pass_mark);
  let submission: Submission | null = null;
  let certCode: string | null = null;

  if (userId && enrolled) {
    const { data } = await supabase
      .from("project_submissions")
      .select(
        "title, description, project_url, repo_url, show_public, status, score, feedback"
      )
      .eq("course_id", courseId)
      .eq("user_id", userId)
      .maybeSingle();
    submission = (data ?? null) as Submission | null;

    const { data: cert } = await supabase
      .from("certificates")
      .select("code")
      .eq("course_id", courseId)
      .eq("user_id", userId)
      .maybeSingle();
    certCode = cert?.code ?? null;
  }

  const graded = submission?.status === "graded";
  const passed = graded && (submission?.score ?? 0) >= passMark;

  return (
    <div id="project" className="mt-16 scroll-mt-24">
      <h2 className="text-2xl font-semibold">Final project</h2>
      <div className="mt-4 rounded-2xl bg-white/5 p-6">
        <p className="text-sm text-white/50">
          Pass mark: {passMark}%. Pass the project to earn your certificate.
        </p>
        <p className="mt-3 whitespace-pre-wrap text-white/80">
          {course.project_brief}
        </p>

        {!userId && (
          <p className="mt-6 text-sm text-white/60">
            <Link href="/login" className="text-mint hover:underline">
              Log in
            </Link>{" "}
            and start the course to take on the project.
          </p>
        )}

        {userId && !enrolled && (
          <p className="mt-6 text-sm text-white/60">
            Start the course to unlock the project.
          </p>
        )}

        {userId && enrolled && !allDone && !submission && (
          <p className="mt-6 text-sm text-white/60">
            🔒 Complete all lessons to unlock the project.
          </p>
        )}

        {userId && enrolled && submission && !graded && (
          <p className="mt-6 rounded-lg bg-white/10 p-4 text-sm">
            ⏳ Submitted. Waiting for review. You can still edit it below.
          </p>
        )}

        {userId && enrolled && graded && passed && (
          <div className="mt-6 rounded-lg bg-mint/15 p-4">
            <p className="font-semibold text-mint">
              🎉 Passed with {submission?.score}%
            </p>
            {submission?.feedback && (
              <p className="mt-2 whitespace-pre-wrap text-sm text-white/80">
                {submission.feedback}
              </p>
            )}
            {certCode && (
              <Link
                href={`/verify/${certCode}`}
                className="mt-3 inline-block text-sm font-semibold text-mint hover:underline"
              >
                View your certificate →
              </Link>
            )}
          </div>
        )}

        {userId && enrolled && graded && !passed && (
          <div className="mt-6 rounded-lg bg-white/10 p-4">
            <p className="font-semibold">
              Not there yet: you scored {submission?.score}%, the pass mark is{" "}
              {passMark}%.
            </p>
            {submission?.feedback && (
              <p className="mt-2 whitespace-pre-wrap text-sm text-white/80">
                {submission.feedback}
              </p>
            )}
            <p className="mt-2 text-sm text-white/60">
              Improve your project and resubmit below.
            </p>
          </div>
        )}

        {userId && enrolled && (allDone || submission) && (
          <>
            <p className="mt-6 text-xs text-white/40">
              Your certificate will show the name on your profile.
            </p>
            <ProjectForm
              key={`${submission?.status}-${submission?.score}-${submission?.title}`}
              courseId={courseId}
              userId={userId}
              exists={!!submission}
              locked={passed}
              initial={{
                title: submission?.title ?? "",
                description: submission?.description ?? "",
                project_url: submission?.project_url ?? "",
                repo_url: submission?.repo_url ?? "",
                show_public: submission?.show_public ?? false,
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}