import type { Metadata } from "next";
import ProductLanding from "@/components/ProductLanding";

export const metadata: Metadata = {
  title: "HangIn | IsaacDev",
  description: "Private project reviews and client feedback.",
};

export default function Page() {
  return <ProductLanding slug="hangin" />;
}