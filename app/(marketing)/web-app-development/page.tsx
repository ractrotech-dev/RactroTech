import { getServicePageMetadata, ServicePage } from '@/components/marketing/service-page';

export const metadata = getServicePageMetadata('web-app-development');

export default function WebAppDevelopmentPage() {
  return <ServicePage slug="web-app-development" />;
}
