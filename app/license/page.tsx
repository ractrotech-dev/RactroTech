import { LegalLayout, LegalSection, LegalParagraph, LegalList } from '@/components/LegalLayout';
import { constructMetadata, sitePath } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'License',
  description: 'Review the licensing terms for using Ractrotech templates, tools, and services.',
  canonicalUrl: sitePath('/license'),
});

export default function LicensePage() {
  return (
    <LegalLayout title="License" lastUpdated="March 2026">
      <LegalSection title="Overview">
        <LegalParagraph>All materials on RactroTech are licensed, not sold.</LegalParagraph>
        <LegalParagraph>
          You are granted a limited, non-exclusive, non-transferable license to use our services for
          personal or business purposes.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Restrictions">
        <LegalParagraph>You may NOT:</LegalParagraph>
        <LegalList>
          <li>Copy or redistribute content</li>
          <li>Reverse engineer or exploit code</li>
          <li>Use branding without permission</li>
        </LegalList>
        <LegalParagraph className="mt-4 font-semibold text-gray-300">
          Violation may result in termination of access.
        </LegalParagraph>
      </LegalSection>
    </LegalLayout>
  );
}
