import { getProduct, type Product } from "@/lib/products";

export default function ProductMark({
  slug,
  size = 24,
}: {
  slug: Product["slug"];
  size?: number;
}) {
  const color = getProduct(slug).hex;

  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (slug === "learngth") {
    return (
      <svg {...common}>
        <path d="M12 3 2 8l10 5 10-5-10-5Z" />
        <path d="M6 10.5V15c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" />
        <path d="M22 8v6" />
      </svg>
    );
  }

  if (slug === "hangin") {
    return (
      <svg {...common}>
        <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
        <circle cx="9" cy="10" r="0.6" />
        <circle cx="13" cy="10" r="0.6" />
        <circle cx="17" cy="10" r="0.6" />
      </svg>
    );
  }

  if (slug === "livjob") {
    return (
      <svg {...common}>
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <path d="M2 13h20" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="m21 8-9-5-9 5v8l9 5 9-5Z" />
      <path d="m3 8 9 5 9-5" />
      <path d="M12 13v8" />
    </svg>
  );
}