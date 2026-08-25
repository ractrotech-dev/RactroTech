import { getServicePageMetadata, ServicePage } from '@/components/marketing/service-page';

export const metadata = getServicePageMetadata('nextjs-development');

export default function NextjsDevelopmentPage() {
  return <ServicePage slug="nextjs-development" />;
}
