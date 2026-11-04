import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact | IsaacDev",
  description: "Get in touch with the IsaacDev team.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-bg text-white">
      <SiteHeader />

      <section className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold">Contact us</h1>
        <p className="mt-4 text-white/70">
          Questions, feedback, instructor enquiries or a problem with a
          certificate? Send us an email and we will get back to you.
        </p>
        <a
          href={`mailto:${SITE.contactEmail}`}
          className="mt-8 inline-block rounded-xl bg-mint px-7 py-4 font-semibold text-bg"
        >
          {SITE.contactEmail}
        </a>
      </section>

      <SiteFooter />
    </main>
  );
}