import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import HeroArt from "@/components/HeroArt";
import ProductMark from "@/components/ProductMark";
import VerifiedStar from "@/components/VerifiedStar";
import FeaturedCourses from "@/components/FeaturedCourses";
import Reveal from "@/components/Reveal";
import TypingHeadline from "@/components/TypingHeadline";
import { products, statusLabel } from "@/lib/products";

const steps = [
  { icon: "learngth", title: "Learn", text: "Take courses and build real skills.", color: "#4da3ff" },
  { icon: "verified", title: "Prove", text: "Pass a graded project and earn a verified certificate.", color: "#55cc93" },
  { icon: "hangin", title: "Collaborate", text: "Share work privately with clients and get feedback.", color: "#8b7cff" },
  { icon: "livjob", title: "Earn", text: "Find clients and jobs without paying for credits.", color: "#f2b544" },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen bg-bg text-white">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="dot-grid absolute inset-0 opacity-60" aria-hidden />
        <div
          className="animate-drift absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(85,204,147,0.22), transparent 70%)" }}
          aria-hidden
        />
        <div
          className="animate-drift absolute -bottom-40 -left-40 h-[480px] w-[480px] rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(139,124,255,0.18), transparent 70%)",
            animationDelay: "4s",
          }}
          aria-hidden
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-28">
          <div>
            <p className="inline-block rounded-full border border-mint/40 px-4 py-1 text-xs font-medium text-mint">
              Built for Africa&apos;s next generation of creators
            </p>

            <TypingHeadline className="mt-6 block min-h-[1.2em] text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl" />

            <p className="mt-6 max-w-xl text-lg text-white/70">
              IsaacDev is an ecosystem of products for developers and digital
              creators: learn real skills, prove them with verified projects,
              work with clients, and find opportunities you can trust.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/learngth"
                className="rounded-xl bg-mint px-7 py-4 font-semibold text-bg transition hover:brightness-110"
              >
                Start learning
              </Link>
              <Link
                href="/signup"
                className="rounded-xl border border-white/20 px-7 py-4 font-semibold transition hover:bg-white/10"
              >
                Create free account
              </Link>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-sm text-white/60">
              <li>✓ Free to start</li>
              <li>✓ Project-backed certificates</li>
              <li>✓ Verifiable online</li>
            </ul>
          </div>

          <HeroArt />
        </div>
      </section>

      <section id="products" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20">
        <Reveal>
          <h2 className="text-3xl font-bold sm:text-4xl">One ecosystem, four products</h2>
          <p className="mt-3 max-w-2xl text-white/60">
            Each product works on its own. Together they take you from learning
            a skill to getting paid for it.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => (
            <Reveal key={p.slug} delay={i * 100} className="h-full">
              <Link
                href={p.href}
                className="group block h-full overflow-hidden rounded-3xl bg-white/5 transition duration-200 hover:-translate-y-1 hover:bg-white/10 hover:shadow-2xl hover:shadow-black/40"
              >
                <div
                  className="relative flex h-40 items-center justify-center"
                  style={{
                    background: `radial-gradient(circle at 30% 20%, ${p.hex}55, transparent 60%), linear-gradient(160deg, ${p.hex}22, #1c1a1b)`,
                  }}
                >
                  <div
                    className="flex h-20 w-20 items-center justify-center rounded-2xl transition-transform duration-200 group-hover:scale-110"
                    style={{
                      background: `${p.hex}1f`,
                      border: `1px solid ${p.hex}66`,
                      boxShadow: `0 0 40px ${p.hex}40`,
                    }}
                  >
                    <ProductMark slug={p.slug} size={40} />
                  </div>
                  <span className="absolute right-3 top-3 rounded-full bg-black/40 px-3 py-1 text-[11px] text-white/80 backdrop-blur">
                    {statusLabel[p.status]}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold">
                    <span className="text-ash">{p.grey}</span>
                    <span style={{ color: p.hex }}>{p.accent}</span>
                  </h3>
                  <p className="mt-2 text-sm text-white/70">{p.pitch}</p>
                  <p className="mt-4 text-sm font-semibold" style={{ color: p.hex }}>
                    {p.status === "open" ? "Open Learngth →" : "Learn more →"}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <Reveal>
          <h2 className="text-center text-3xl font-bold sm:text-4xl">How IsaacDev works</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 100} className="h-full">
              <div className="h-full rounded-2xl bg-white/5 p-6" style={{ borderTop: `3px solid ${s.color}` }}>
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ background: `${s.color}1f` }}
                >
                  {s.icon === "verified" ? (
                    <VerifiedStar size={32} />
                  ) : (
                    <ProductMark slug={s.icon} size={30} />
                  )}
                </div>
                <h3 className="mt-5 text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-white/70">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <FeaturedCourses />

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <Reveal>
          <div
            className="rounded-3xl p-10 text-center sm:p-14"
            style={{ background: "linear-gradient(135deg, #1c5a40, #143528)" }}
          >
            <h2 className="text-3xl font-bold sm:text-4xl">
              Ready to build something real?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/80">
              Join free, take your first course, and start building a profile
              that proves what you can do.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-block rounded-xl bg-white px-8 py-4 font-semibold text-bg transition hover:brightness-95"
            >
              Create your free account
            </Link>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </main>
  );
}