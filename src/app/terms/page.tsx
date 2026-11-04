import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use | IsaacDev",
};

const sections: LegalSection[] = [
  {
    heading: "Using IsaacDev",
    body: [
      `These terms apply when you use ${SITE.name}, operated by ${SITE.company}. By creating an account or using the platform, you agree to them.`,
      "You must be at least 16 and give accurate information. Keep your login details private. You are responsible for activity on your account.",
    ],
  },
  {
    heading: "Your content",
    body: [
      "You keep ownership of what you create and submit, including projects and reviews. You give us permission to store and display it as needed to run the platform, for example showing your review or, if you choose, your project on your certificate page.",
      "Only submit work that is yours, or that you have the right to share. Do not submit work copied from others.",
    ],
  },
  {
    heading: "Instructors and courses",
    body: [
      "Instructor accounts and courses are reviewed before they appear. We may reject, edit or remove a course that does not meet our standards.",
      "Instructors must have the right to use all material in their courses.",
    ],
  },
  {
    heading: "Projects, grading and certificates",
    body: [
      "Projects are graded by reviewers. A certificate is issued only when a project meets the pass mark. Our decisions on grading are made in good faith, and you can improve and resubmit.",
      "Certificates are governed by our Certificate Policy. We may revoke a certificate that was issued by mistake or obtained through cheating or fraud.",
    ],
  },
  {
    heading: "Acceptable use",
    body: [
      "Do not cheat, plagiarise, impersonate others, harass people, post scams or illegal content, or try to break, overload or gain unauthorised access to the platform.",
      "We may remove content and suspend or close accounts that break these rules.",
    ],
  },
  {
    heading: "Third-party services",
    body: [
      "Some lessons use videos hosted on YouTube. Those services have their own terms and privacy practices.",
    ],
  },
  {
    heading: "No guarantees about jobs or income",
    body: [
      "Learning on IsaacDev or earning a certificate does not guarantee a job, clients or income.",
    ],
  },
  {
    heading: "Availability and liability",
    body: [
      "We work to keep IsaacDev available and accurate, but it is provided as it is. To the extent the law allows, we are not liable for indirect or consequential losses arising from your use of the platform.",
    ],
  },
  {
    heading: "Ending your account",
    body: [
      "You can stop using IsaacDev at any time. We may suspend or end accounts that break these terms.",
    ],
  },
  {
    heading: "Changes and contact",
    body: [
      `We may update these terms and will change the date above when we do. Questions? Contact us at ${SITE.contactEmail}.`,
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      intro="These are the rules for using IsaacDev. They are written to be clear and fair."
      sections={sections}
    />
  );
}