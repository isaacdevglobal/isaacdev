import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Certificate Policy | IsaacDev",
};

const sections: LegalSection[] = [
  {
    heading: "What a Learngth certificate is",
    body: [
      "A Learngth certificate is an evidence-based digital credential. It shows that the holder completed a course and passed a graded final project.",
      "It is not a government-accredited, university or professional-body qualification, and we do not claim that it is.",
    ],
  },
  {
    heading: "How you earn one",
    body: [
      "Complete all lessons in the course, submit the final project, and reach the course pass mark. Watching videos alone does not earn a certificate. If you complete the lessons but do not pass the project, you keep your course progress and can improve and resubmit.",
    ],
  },
  {
    heading: "Verification",
    body: [
      "Every certificate has a unique ID and a public verification page. Anyone with the ID can check the holder's name, the course, the score, the issue date and whether the certificate is valid or revoked.",
      "The project behind the certificate is shown on that page only if the holder chose to make it public.",
    ],
  },
  {
    heading: "Name on the certificate",
    body: [
      "A certificate shows the name on the holder's profile when it is issued. Please make sure your profile name is correct before you submit your final project.",
    ],
  },
  {
    heading: "Revocation",
    body: [
      "We may revoke a certificate that was issued by mistake or obtained through cheating, plagiarism or fraud. A revoked certificate stays on its verification page, clearly marked as revoked.",
    ],
  },
  {
    heading: "Reporting a concern",
    body: [
      `If you think a certificate is fake or misused, contact us at ${SITE.contactEmail} with the certificate ID.`,
    ],
  },
];

export default function CertificatePolicyPage() {
  return (
    <LegalPage
      title="Certificate Policy"
      intro="What our certificates mean, how they are earned, and how anyone can check them."
      sections={sections}
    />
  );
}