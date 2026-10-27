'use client';
import { useEffect, useState } from 'react';
import { cloudEnabled } from '@/lib/supabase';
import { cloudShared, demoShared } from '@/lib/store';
import { ClientPanelView } from './ClientPanel';
import { CenterMessage } from './ui';

export default function SharedReport({ token }) {
  const [report, setReport] = useState(undefined); // undefined = carregando, null = não encontrado
  const [tab, setTab] = useState('executivo');
  const [monthId, setMonthId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        if (token.startsWith('demo-')) return setReport(demoShared(token));
        if (!cloudEnabled) return setReport(null);
        setReport(await cloudShared(token));
      } catch (e) {
        setReport(null);
      }
    })();
  }, [token]);

  if (report === undefined) return <CenterMessage title="Carregando relatório…" />;
  if (!report) return (
    <CenterMessage title="Relatório não encontrado">
      <p>Este link foi desativado ou está incompleto. Peça um link novo para a sua gestora de social media.</p>
    </CenterMessage>
  );

  return (
    <div className="fade-in">
      <div className="bg-slate-900 h-1.5" />
      <ClientPanelView client={report.client} gestora={report.gestora} update={() => {}} editable={false}
        clientMode tab={tab} setTab={setTab} monthId={monthId} setMonthId={setMonthId} />
    </div>
  );
}
