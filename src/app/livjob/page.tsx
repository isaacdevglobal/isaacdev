import type { Metadata } from "next";
import ProductLanding from "@/components/ProductLanding";

export const metadata: Metadata = {
  title: "LivJob | IsaacDev",
  description: "Jobs and freelance work without paying for credits.",
};

export default function Page() {
  return <ProductLanding slug="livjob" />;
}