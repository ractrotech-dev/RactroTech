import { LegalLayout, LegalSection, LegalParagraph } from '@/components/LegalLayout';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: "Terms of Service",
  description: "Read the RactroTech Terms of Service to understand your rights and responsibilities when using our platform.",
  canonicalUrl: "https://ractrotech.com/terms",
});

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="March 2026">
      <LegalSection title="Welcome">
        <LegalParagraph>
          Welcome to RactroTech. By accessing or using our website, products, and services, you
          agree to comply with and be bound by these Terms.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="1. Use of Services">
        <LegalParagraph>
          You agree to use our services only for lawful purposes and in a way that does not infringe
          the rights of others.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="2. Intellectual Property">
        <LegalParagraph>
          All content, designs, code, and branding on this platform are the property of RactroTech
          and may not be reused without permission.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="3. User Accounts">
        <LegalParagraph>
          You are responsible for maintaining the confidentiality of your account and any activities
          under it.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="4. Service Modifications">
        <LegalParagraph>
          We reserve the right to modify or discontinue any part of our services at any time without
          notice.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="5. Limitation of Liability">
        <LegalParagraph>
          RactroTech shall not be liable for any indirect, incidental, or consequential damages
          arising from the use of our services.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="6. Termination">
        <LegalParagraph>
          We may suspend or terminate access if users violate these terms.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="7. Governing Law">
        <LegalParagraph>These terms are governed by applicable laws in India.</LegalParagraph>
      </LegalSection>
    </LegalLayout>
  );
}
