import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ProductMark from "@/components/ProductMark";
import VerifiedStar from "@/components/VerifiedStar";
import FeaturedCourses from "@/components/FeaturedCourses";

export const metadata: Metadata = {
  title: "Learngth | IsaacDev",
  description: "Courses with real projects and verifiable certificates.",
};

const steps = [
  { icon: "📖", title: "Learn", text: "Work through short lessons at your own pace, free to start." },
  { icon: "🛠", title: "Build a project", text: "Apply what you learned in a real project, not a quiz." },
  { icon: "✅", title: "Get it graded", text: "Reviewers score your project against the pass mark." },
  { icon: "🎓", title: "Earn a certificate", text: "Get a certificate with a public page anyone can verify." },
];

export default function LearngthPage() {
  const blue = "#4da3ff";

  return (
    <main className="min-h-screen bg-bg text-white">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div
          className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, ${blue}40, transparent 70%)` }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center">
          <div
            className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl"
            style={{
              background: `linear-gradient(135deg, ${blue}33, ${blue}0d)`,
              boxShadow: `0 0 60px ${blue}40`,
              border: `1px solid ${blue}55`,
            }}
          >
            <ProductMark slug="learngth" size={48} />
          </div>
          <h1 className="mt-8 text-5xl font-bold sm:text-6xl">
            <span className="text-ash">Learn</span>
            <span style={{ color: blue }}>gth</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-xl text-white/80">
            Learn real skills. Prove them with real projects.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-white/60">
            Courses in development, AI, thinking and more, each ending in a
            graded project and a certificate anyone can verify.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/courses"
              className="rounded-xl px-7 py-4 font-semibold text-bg transition hover:brightness-110"
              style={{ background: blue }}
            >
              Browse courses
            </Link>
            <Link
              href="/signup"
              className="rounded-xl border border-white/20 px-7 py-4 font-semibold transition hover:bg-white/10"
            >
              Create free account
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-center text-3xl font-bold">How it works</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="rounded-2xl bg-white/5 p-6">
              <div className="text-4xl">{s.icon}</div>
              <p className="mt-4 text-xs text-white/40">Step {i + 1}</p>
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-white/70">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <FeaturedCourses />

      <section className="mx-auto max-w-4xl px-6 pb-20">
        <div className="rounded-3xl bg-white/5 p-10 text-center">
          <div className="flex justify-center">
            <VerifiedStar size={48} />
          </div>
          <h2 className="mt-4 text-2xl font-bold">Certificates that mean something</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/70">
            A certificate only exists if you passed a graded project. Every one
            has its own ID and a public page, and revoked ones show as revoked.
            Learngth credentials are not government-accredited qualifications.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24 text-center">
        <h2 className="text-2xl font-bold">Want to teach?</h2>
        <p className="mt-3 text-white/60">
          Instructor accounts are reviewed by our team so quality stays high.
        </p>
        <Link
          href="/instructor"
          className="mt-6 inline-block rounded-xl border border-white/20 px-6 py-3 font-semibold hover:bg-white/10"
        >
          Teach on Learngth
        </Link>
      </section>

      <SiteFooter />
    </main>
  );
}