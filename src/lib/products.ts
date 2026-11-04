export type Product = {
  slug: "learngth" | "hangin" | "livjob" | "build";
  grey: string;
  accent: string;
  hex: string;
  tagline: string;
  pitch: string;
  status: "open" | "soon" | "limited";
  href: string;
  bullets: string[];
  steps: string[];
};

export const products: Product[] = [
  {
    slug: "learngth",
    grey: "Learn",
    accent: "gth",
    hex: "#4da3ff",
    tagline: "Courses and verified certificates",
    pitch:
      "Learn real skills with courses that end in a graded project, and earn certificates anyone can verify online.",
    status: "open",
    href: "/learngth",
    bullets: [
      "Structured courses, free to start",
      "A real project graded by reviewers",
      "Certificates with a public verification page",
    ],
    steps: ["Learn the lessons", "Submit your project", "Earn a verified certificate"],
  },
  {
    slug: "hangin",
    grey: "Hang",
    accent: "In",
    hex: "#8b7cff",
    tagline: "Private project reviews",
    pitch:
      "Share work with clients privately, collect feedback right on the page, and get approval before you hand anything over.",
    status: "soon",
    href: "/hangin",
    bullets: [
      "Private preview links that expire",
      "Comments pinned to the exact spot",
      "Approve, request changes, repeat",
    ],
    steps: ["Share a private preview", "Client leaves feedback", "Approve and deliver"],
  },
  {
    slug: "livjob",
    grey: "Liv",
    accent: "Job",
    hex: "#f2b544",
    tagline: "Jobs and freelance work",
    pitch:
      "Find clients and projects without paying for credits. Built for developers and digital creators, and open to other professionals.",
    status: "soon",
    href: "/livjob",
    bullets: [
      "Free to apply for work",
      "Portfolios and verified profiles",
      "Clients and freelancers, both verified",
    ],
    steps: ["Build your profile", "Find or post work", "Agree and deliver"],
  },
  {
    slug: "build",
    grey: "Isaac",
    accent: "Build",
    hex: "#55cc93",
    tagline: "A workspace for builders",
    pitch:
      "A workspace to build websites, games and digital products, connect your projects and publish them to your portfolio.",
    status: "limited",
    href: "/build",
    bullets: [
      "Connect your GitHub projects",
      "Publish work to your portfolio",
      "Native building tools coming later",
    ],
    steps: ["Create a project", "Build and connect", "Publish to your portfolio"],
  },
];

export const statusLabel: Record<Product["status"], string> = {
  open: "Open now",
  soon: "Coming soon",
  limited: "Early access soon",
};

export function getProduct(slug: Product["slug"]): Product {
  return products.find((p) => p.slug === slug) as Product;
}