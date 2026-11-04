import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import { SITE } from "@/lib/site";

export type LegalSection = { heading: string; body: string[] };

export default function LegalPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro?: string;
  sections: LegalSection[];
}) {
  return (
    <main className="min-h-screen bg-bg text-white">
      <SiteHeader />

      <article className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="mt-2 text-sm text-white/40">Last updated: {SITE.updated}</p>
        {intro && <p className="mt-6 text-lg text-white/70">{intro}</p>}

        <div className="mt-10 space-y-10">
          {sections.map((s, i) => (
            <section key={s.heading}>
              <h2 className="text-xl font-semibold">
                {i + 1}. {s.heading}
              </h2>
              <div className="mt-3 space-y-3 text-white/70">
                {s.body.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}