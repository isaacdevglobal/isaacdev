import { redirect } from "next/navigation";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { createClient } from "@/lib/supabase/server";
import CertificateActions from "./CertificateActions";

type Cert = {
  id: string;
  code: string;
  course_title: string;
  score: number;
  status: string;
  issued_at: string;
};

export default async function CertificatesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("certificates")
    .select("id, code, course_title, score, status, issued_at")
    .eq("user_id", user.id)
    .order("issued_at", { ascending: false });
  const certs = (data ?? []) as Cert[];

  return (
    <main className="min-h-screen bg-bg text-white">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-6 pb-24">
        <h1 className="text-3xl font-bold">My certificates</h1>

        {certs.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-white/5 p-8">
            <p className="text-white/70">
              Finish a course and pass its project to earn your first
              certificate.
            </p>
            <Link
              href="/courses"
              className="mt-4 inline-block text-mint hover:underline"
            >
              Browse courses →
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {certs.map((c) => (
              <div key={c.id} className="rounded-2xl bg-white/5 p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-xl font-semibold">{c.course_title}</h2>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs ${
                      c.status === "valid"
                        ? "border-mint text-mint"
                        : "border-red-400 text-red-400"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-white/60">
                  Score {c.score}% · ID{" "}
                  <span className="font-mono">{c.code}</span>
                </p>
                <CertificateActions
                  code={c.code}
                  courseTitle={c.course_title}
                  issuedAt={c.issued_at}
                  status={c.status}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}