import { getServicePageMetadata, ServicePage } from '@/components/marketing/service-page';

export const metadata = getServicePageMetadata('saas-development');

export default function SaasDevelopmentPage() {
  return <ServicePage slug="saas-development" />;
}
