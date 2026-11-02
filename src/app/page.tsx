import SiteHeader from "@/components/SiteHeader";

type Product = {
  grey: string;
  accent: string;
  color: string;
  tagline: string;
  status: string;
};

const products: Product[] = [
  {
    grey: "Learn",
    accent: "gth",
    color: "var(--learngth)",
    tagline: "Courses, real projects and credentials you can verify.",
    status: "In development",
  },
  {
    grey: "Hang",
    accent: "In",
    color: "var(--hangin)",
    tagline: "Private project reviews and client feedback.",
    status: "In development",
  },
  {
    grey: "Liv",
    accent: "Job",
    color: "var(--livjob)",
    tagline: "Find clients and projects, and get hired.",
    status: "In development",
  },
  {
    grey: "Isaac",
    accent: "Build",
    color: "var(--mint)",
    tagline: "Build websites, games and digital products.",
    status: "Limited access",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-bg text-white">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-6 py-24">
        <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">
          Learn. Build. Connect. <span className="text-mint">Earn.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-white/70">
          An ecosystem for Africa&apos;s next generation of developers and
          digital creators: learn real skills, prove them, and find work you can
          trust.
        </p>
      </section>

      <section id="products" className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="mb-8 text-2xl font-semibold">Our products</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <div
              key={p.grey + p.accent}
              className="rounded-2xl bg-white/5 p-6"
              style={{ borderTop: `4px solid ${p.color}` }}
            >
              <div className="text-2xl font-bold">
                <span className="text-ash">{p.grey}</span>
                <span style={{ color: p.color }}>{p.accent}</span>
              </div>
              <p className="mt-3 text-sm text-white/70">{p.tagline}</p>
              <span
                className="mt-6 inline-block rounded-full px-3 py-1 text-xs font-medium"
                style={{ color: p.color, border: `1px solid ${p.color}` }}
              >
                {p.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-sm text-white/50">
        © 2026 IsaacDev · Part of LIT-MAK Holdings
      </footer>
    </main>
  );
}