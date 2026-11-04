import type { Metadata } from "next";
import ProductLanding from "@/components/ProductLanding";

export const metadata: Metadata = {
  title: "IsaacBuild | IsaacDev",
  description: "A workspace to build websites, games and digital products.",
};

export default function Page() {
  return <ProductLanding slug="build" />;
}