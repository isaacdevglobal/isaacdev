import Link from "next/link";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import ProductMark from "./ProductMark";
import WaitlistForm from "./WaitlistForm";
import { getProduct, statusLabel, type Product } from "@/lib/products";

export default function ProductLanding({ slug }: { slug: Product["slug"] }) {
  const p = getProduct(slug);

  return (
    <main className="min-h-screen bg-bg text-white">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div
          className="absolute -top-40 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, ${p.hex}40, transparent 70%)` }}
          aria-hidden
        />

        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center">
          <div
            className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl"
            style={{
              background: `linear-gradient(135deg, ${p.hex}33, ${p.hex}0d)`,
              boxShadow: `0 0 60px ${p.hex}40`,
              border: `1px solid ${p.hex}55`,
            }}
          >
            <ProductMark slug={p.slug} size={48} />
          </div>

          <p className="mt-8 inline-block rounded-full border border-white/15 px-4 py-1 text-xs text-white/70">
            {statusLabel[p.status]}
          </p>

          <h1 className="mt-4 text-5xl font-bold sm:text-6xl">
            <span className="text-ash">{p.grey}</span>
            <span style={{ color: p.hex }}>{p.accent}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/70">{p.pitch}</p>

          <div className="mt-10 flex justify-center">
            <WaitlistForm
              product={p.slug}
              color={p.hex}
              label={p.slug === "build" ? "Request access" : "Join the waitlist"}
            />
          </div>
          <p className="mt-3 text-xs text-white/40">
            No spam. One email when it opens.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-12">
        <div className="grid gap-6 md:grid-cols-3">
          {p.bullets.map((b) => (
            <div
              key={b}
              className="rounded-2xl bg-white/5 p-6"
              style={{ borderTop: `3px solid ${p.hex}` }}
            >
              <p className="font-medium">{b}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-center text-2xl font-bold">How it will work</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {p.steps.map((s, i) => (
            <div key={s} className="rounded-2xl bg-white/5 p-6 text-center">
              <div
                className="mx-auto flex h-10 w-10 items-center justify-center rounded-full font-bold text-bg"
                style={{ background: p.hex }}
              >
                {i + 1}
              </div>
              <p className="mt-4 font-medium">{s}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-white/50">
          Meanwhile,{" "}
          <Link href="/learngth" className="text-mint hover:underline">
            Learngth is open now
          </Link>
          .
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}