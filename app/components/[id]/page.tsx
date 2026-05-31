import { ComponentDetailPageClient } from '@/components/sections/components/ComponentDetailPageClient';

export const dynamic = 'force-dynamic';

type ComponentDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ComponentDetailPage({ params }: ComponentDetailPageProps) {
  const { id } = await params;
  return <ComponentDetailPageClient id={id} />;
}
