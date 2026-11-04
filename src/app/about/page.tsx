import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About | IsaacDev",
  description: "Why IsaacDev exists and what we are building.",
};

const principles = [
  {
    title: "Authentic",
    text: "Certificates and profiles show real work that real people can check.",
  },
  {
    title: "Trustworthy",
    text: "Instructors are reviewed, clients and developers can be verified, and bad behaviour has consequences.",
  },
  {
    title: "Built to last",
    text: "We are building a long-term home for creators, not a place people visit once and leave.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-bg text-white">
      <SiteHeader />

      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-bold sm:text-5xl">About IsaacDev</h1>
        <p className="mt-6 text-lg text-white/70">
          Many talented people in Africa struggle to learn properly, prove what
          they can do, and find clients who take them seriously. Existing
          platforms are crowded, expensive to apply on, and hard to use on a
          phone.
        </p>
        <p className="mt-4 text-lg text-white/70">
          IsaacDev is a connected set of products that takes you from learning a
          skill to getting paid for it: Learngth for courses and verified
          certificates, HangIn for private client reviews, LivJob for jobs and
          freelance work, and IsaacBuild for building and publishing your work.
        </p>
        <p className="mt-4 text-white/50">
          IsaacDev is part of {SITE.company}.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          {principles.map((p) => (
            <div key={p.title} className="rounded-2xl bg-white/5 p-6">
              <h2 className="text-xl font-semibold text-mint">{p.title}</h2>
              <p className="mt-2 text-sm text-white/70">{p.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/signup"
            className="inline-block rounded-xl bg-mint px-7 py-4 font-semibold text-bg"
          >
            Join IsaacDev
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}