import { notFound } from 'next/navigation';

import { ServiceDetail } from '@/components/marketing/sections/service-detail';
import {
  constructMetadata,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateServiceSchema,
  sitePath,
} from '@/lib/seo';
import { getServiceBySlug } from '@/lib/marketing/service-pages';

type Props = { slug: string };

export function getServicePageMetadata(slug: string) {
  const service = getServiceBySlug(slug);
  if (!service) return constructMetadata({ title: 'Service not found', noIndex: true });

  return constructMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    canonicalUrl: sitePath(`/${slug}`),
  });
}

export function ServicePage({ slug }: Props) {
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const schemas = [
    generateBreadcrumbSchema([
      { name: 'Home', item: '/' },
      { name: 'Services', item: '/services' },
      { name: service.name, item: `/${slug}` },
    ]),
    generateServiceSchema({
      name: service.name,
      description: service.metaDescription,
      url: sitePath(`/${slug}`),
    }),
    generateFAQSchema(service.faqs),
  ];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <ServiceDetail service={service} />
    </>
  );
}
