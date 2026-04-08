import { LegalLayout, LegalSection, LegalParagraph, LegalList } from '@/components/LegalLayout';

export const metadata = {
  title: 'Privacy Policy - RactroTech',
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="March 2026">
      <LegalSection title="Overview">
        <LegalParagraph>
          At RactroTech, we respect your privacy and are committed to protecting your personal data.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="1. Information We Collect">
        <LegalParagraph>
          We may collect personal information such as name, email, and usage data.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="2. How We Use Information">
        <LegalList>
          <li>To provide and improve services</li>
          <li>To communicate updates</li>
          <li>To enhance user experience</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="3. Data Protection">
        <LegalParagraph>
          We implement industry-standard security measures to protect your data.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="4. Third-Party Services">
        <LegalParagraph>
          We may use third-party tools (analytics, authentication, etc.) that collect limited data.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="5. Cookies">
        <LegalParagraph>
          We use cookies to improve functionality and user experience.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="6. Your Rights">
        <LegalParagraph>
          You may request access, correction, or deletion of your personal data.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="7. Updates">
        <LegalParagraph>We may update this policy from time to time.</LegalParagraph>
      </LegalSection>
    </LegalLayout>
  );
}
