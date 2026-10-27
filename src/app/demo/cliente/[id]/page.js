import ClientPage from '@/components/ClientPanel';

export default function Page({ params, searchParams }) {
  return <ClientPage id={params.id} initialTab={searchParams?.aba} />;
}
