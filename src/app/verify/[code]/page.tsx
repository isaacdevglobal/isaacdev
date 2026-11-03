import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { createClient } from "@/lib/supabase/server";

type Cert = {
  code: string;
  holder_name: string;
  course_title: string;
  score: number;
  status: string;
  issued_at: string;
  revoked_at: string | null;
  project_title: string | null;
  project_description: string | null;
  project_url: string | null;
  repo_url: string | null;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const supabase = await createClient();

  const { data } = await supabase.rpc("verify_certificate", { p_code: code });
  const cert = (Array.isArray(data) && data.length > 0 ? data[0] : null) as Cert | null;

  return (
    <main className="min-h-screen bg-bg text-white">
      <SiteHeader />

      <section className="mx-auto max-w-3xl px-6 pb-24">
        {!cert ? (
          <div className="rounded-3xl bg-white/5 p-10 text-center">
            <p className="text-5xl">❌</p>
            <h1 className="mt-4 text-2xl font-bold">Certificate not found</h1>
            <p className="mt-2 text-white/60">
              We could not find a certificate with the code{" "}
              <span className="font-mono">{code}</span>. Check the code and try
              again.
            </p>
          </div>
        ) : (
          <>
            <div
              className="rounded-3xl p-8 sm:p-10"
              style={{
                background:
                  cert.status === "valid"
                    ? "linear-gradient(135deg, #1c5a40, #143528)"
                    : "linear-gradient(135deg, #5a1c1c, #351414)",
              }}
            >
              <p className="text-sm font-semibold uppercase tracking-wide">
                {cert.status === "valid" ? "✓ Valid certificate" : "✕ Revoked certificate"}
              </p>
              <p className="mt-6 text-sm text-white/70">This certifies that</p>
              <h1 className="mt-1 text-4xl font-bold">{cert.holder_name}</h1>
              <p className="mt-4 text-sm text-white/70">
                completed and passed the project for
              </p>
              <h2 className="mt-1 text-2xl font-semibold">{cert.course_title}</h2>

              <dl className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-white/60">Issued by</dt>
                  <dd className="font-medium">IsaacDev Learngth</dd>
                </div>
                <div>
                  <dt className="text-white/60">Issue date</dt>
                  <dd className="font-medium">{formatDate(cert.issued_at)}</dd>
                </div>
                <div>
                  <dt className="text-white/60">Project score</dt>
                  <dd className="font-medium">{cert.score}%</dd>
                </div>
                <div>
                  <dt className="text-white/60">Certificate ID</dt>
                  <dd className="font-mono font-medium">{cert.code}</dd>
                </div>
              </dl>

              {cert.status === "revoked" && cert.revoked_at && (
                <p className="mt-6 text-sm text-white/80">
                  This certificate was revoked on {formatDate(cert.revoked_at)}.
                </p>
              )}
            </div>

            {cert.project_title && (
              <div className="mt-6 rounded-2xl bg-white/5 p-6">
                <p className="text-xs uppercase tracking-wide text-white/50">
                  The project behind this certificate
                </p>
                <h3 className="mt-2 text-xl font-semibold">{cert.project_title}</h3>
                {cert.project_description && (
                  <p className="mt-2 whitespace-pre-wrap text-white/80">
                    {cert.project_description}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  {cert.project_url && (
                    <a
                      href={cert.project_url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="text-mint hover:underline"
                    >
                      View project ↗
                    </a>
                  )}
                  {cert.repo_url && (
                    <a
                      href={cert.repo_url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="text-mint hover:underline"
                    >
                      View code ↗
                    </a>
                  )}
                </div>
              </div>
            )}

            <p className="mt-6 text-xs text-white/40">
              IsaacDev Learngth credentials are evidence-based digital
              credentials that show completed learning and a reviewed project.
              They are not government-accredited qualifications.
            </p>
          </>
        )}

        <p className="mt-8 text-center text-sm">
          <Link href="/courses" className="text-mint hover:underline">
            Explore Learngth courses
          </Link>
        </p>
      </section>
    </main>
  );
}