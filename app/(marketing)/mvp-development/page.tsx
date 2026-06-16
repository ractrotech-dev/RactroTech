import { getServicePageMetadata, ServicePage } from '@/components/marketing/service-page';

export const metadata = getServicePageMetadata('mvp-development');

export default function MvpDevelopmentPage() {
  return <ServicePage slug="mvp-development" />;
}
