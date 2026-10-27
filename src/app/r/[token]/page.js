import SharedReport from '@/components/SharedReport';

export const metadata = { title: 'Relatório de Performance', robots: { index: false } };

export default function Page({ params }) {
  return <SharedReport token={params.token} />;
}
