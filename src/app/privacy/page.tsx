import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy | IsaacDev",
};

const sections: LegalSection[] = [
  {
    heading: "Who we are",
    body: [
      `${SITE.name} is operated by ${SITE.company}. This policy explains what personal information we collect, why, and the choices you have. You can contact us at ${SITE.contactEmail}.`,
    ],
  },
  {
    heading: "Information we collect",
    body: [
      "Account information: your name, email address and password. Passwords are handled by our authentication provider and are not stored in readable form.",
      "Profile information you add: username and bio.",
      "Learning activity: courses you start, lessons you complete, courses you save, and reviews you write.",
      "Projects you submit: titles, descriptions and links, and the scores and feedback you receive.",
      "Certificates issued to you, and email addresses you give us to join a waitlist.",
      "Basic technical information such as logs needed to keep the service secure and working.",
    ],
  },
  {
    heading: "How we use your information",
    body: [
      "To run your account, provide courses, grade projects, issue and verify certificates, and show your profile.",
      "To keep the platform safe, prevent cheating and fraud, and respond to reports.",
      "To email you about your account, and about products you asked to hear about.",
      "To understand how the platform is used so we can improve it.",
    ],
  },
  {
    heading: "What is public",
    body: [
      "Your profile name, username and bio can be seen by anyone. Reviews you post are public, with your name.",
      "A certificate can be checked by anyone who has its ID. It shows the name on your profile, the course, the score and the issue date. Your project is shown on the certificate page only if you choose to make it public.",
    ],
  },
  {
    heading: "Who we share information with",
    body: [
      "We do not sell your personal information.",
      "We use service providers to run the platform, such as hosting, database and authentication, and email delivery. They process data only to provide those services to us.",
      "We may disclose information if the law requires it or to protect the safety of our users and platform.",
    ],
  },
  {
    heading: "How long we keep information",
    body: [
      "We keep information while your account is active and for as long as needed to run the service, issue and verify certificates, and meet legal obligations.",
    ],
  },
  {
    heading: "Your rights",
    body: [
      "Depending on where you live, including under Nigerian data protection law, you may have the right to access, correct or delete your personal information, and to object to some uses. To use these rights, contact us at the email above.",
    ],
  },
  {
    heading: "Security",
    body: [
      "We use reasonable technical and organisational measures to protect your information, including access controls on our database. No online service can be completely secure, so please use a strong, unique password.",
    ],
  },
  {
    heading: "Age",
    body: [
      "You must be at least 16 to create an account. If you are under 18, please ask a parent or guardian before using IsaacDev.",
    ],
  },
  {
    heading: "Changes to this policy",
    body: [
      "We may update this policy. When we make important changes, we will update the date at the top and, where appropriate, tell you.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="We collect only what we need to run IsaacDev, and we explain it here in plain language."
      sections={sections}
    />
  );
}