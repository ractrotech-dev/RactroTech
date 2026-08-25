import { getServicePageMetadata, ServicePage } from '@/components/marketing/service-page';

export const metadata = getServicePageMetadata('ui-ux-design');

export default function UiUxDesignPage() {
  return <ServicePage slug="ui-ux-design" />;
}
