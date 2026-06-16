import { getServicePageMetadata, ServicePage } from '@/components/marketing/service-page';

export const metadata = getServicePageMetadata('startup-development');

export default function StartupDevelopmentPage() {
  return <ServicePage slug="startup-development" />;
}
