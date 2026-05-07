import { LegalLayout, LegalSection, LegalParagraph, LegalList } from '@/components/LegalLayout';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: "Cookies Policy",
  description: "Learn about how RactroTech uses cookies to improve your browsing experience.",
  canonicalUrl: "https://ractrotech.com/cookies",
});

export default function CookiesPage() {
  return (
    <LegalLayout title="Cookies Policy" lastUpdated="March 2026">
      <LegalSection title="Overview">
        <LegalParagraph>RactroTech uses cookies to enhance user experience.</LegalParagraph>
      </LegalSection>

      <LegalSection title="1. What Are Cookies?">
        <LegalParagraph>Small files stored on your device to improve functionality.</LegalParagraph>
      </LegalSection>

      <LegalSection title="2. Types of Cookies We Use">
        <LegalList>
          <li>
            <strong className="text-white">Essential cookies:</strong> site functionality
          </li>
          <li>
            <strong className="text-white">Analytics cookies:</strong> usage insights
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="3. Managing Cookies">
        <LegalParagraph>You can disable cookies through your browser settings.</LegalParagraph>
      </LegalSection>

      <LegalSection title="4. Consent">
        <LegalParagraph>By using our site, you consent to our use of cookies.</LegalParagraph>
      </LegalSection>
    </LegalLayout>
  );
}
