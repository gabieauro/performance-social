'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { currentFollowers, fmt, fmtK, growth, lastMonth, monthLeads, sortedMonths, ymLabel } from '@/lib/format';
import { useWorkspace } from './workspace';
import AppHeader from './AppHeader';
import ClientModal from './ClientModal';
import { Avatar, ConfirmButton, Delta, Sparkline, btnAccent, btnGhost, btnPrimary, card } from './ui';

export default function ClientsHome() {
  const { state, base, mode, addClient, loadSample, removeSamples } = useWorkspace();
  const router = useRouter();
  const [modal, setModal] = useState(false);
  const [loadingSample, setLoadingSample] = useState(false);
  const hasSamples = state.clients.some(c => c.sample);

  const totals = useMemo(() => {
    let gained = 0, leads = 0, contracts = 0;
    state.clients.forEach(c => {
      gained += currentFollowers(c) - (c.marcoZero.followers || 0);
      const l = lastMonth(c);
      if (l) { leads += monthLeads(l); contracts += l.contracts || 0; }
    });
    return { gained, leads, contracts };
  }, [state.clients]);

  const onSave = async c => {
    const created = await addClient(c);
    setModal(false);
    router.push(`${base}/cliente/${created.id}?aba=marco`);
  };

  return (
    <div className="fade-in">
      <AppHeader>
        <button type="button" className={btnAccent} onClick={() => setModal(true)}>+ Novo Cliente</button>
      </AppHeader>

      <main className="gutter max-w-6xl mx-auto py-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold text-emerald-700 eyebrow">Carteira</p>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight mt-1">Meus Clientes</h1>
          </div>
          <dl className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <div><dt className="text-slate-500">Clientes ativos</dt><dd className="font-semibold text-slate-900 tnum text-lg">{state.clients.length}</dd></div>
            <div><dt className="text-slate-500">Seguidores ganhos na gestão</dt><dd className="font-semibold text-emerald-700 tnum text-lg">{totals.gained >= 0 ? '+' : ''}{fmt(totals.gained)}</dd></div>
            <div><dt className="text-slate-500">Leads no último mês</dt><dd className="font-semibold text-slate-900 tnum text-lg">{fmt(totals.leads)}</dd></div>
            <div><dt className="text-slate-500">Contratos no último mês</dt><dd className="font-semibold text-slate-900 tnum text-lg">{fmt(totals.contracts)}</dd></div>
          </dl>
        </div>

        {hasSamples && (
          <div className="mb-6 flex flex-wrap items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-600">
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-600 eyebrow">Exemplo</span>
            <span className="min-w-0 flex-1">Os clientes marcados como exemplo servem para você explorar o painel.</span>
            <ConfirmButton label="Remover exemplos" confirmLabel="Remover exemplos" onConfirm={removeSamples} className="!text-slate-600 border border-slate-200" />
          </div>
        )}

        {state.clients.length === 0 ? (
          <div className={`${card} p-10 text-center`}>
            <h2 className="text-lg font-semibold text-slate-900">Nenhum cliente cadastrado</h2>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">Cadastre o primeiro cliente com os números do Marco Zero. A partir daí, cada mês novo mostra o crescimento desde o início da gestão.</p>
            <div className="mt-5 flex flex-wrap gap-2 justify-center">
              <button type="button" className={btnPrimary} onClick={() => setModal(true)}>+ Novo Cliente</button>
              <button type="button" className={btnGhost} disabled={loadingSample} onClick={async () => { setLoadingSample(true); try { await loadSample(); } finally { setLoadingSample(false); } }}>
                {loadingSample ? 'Carregando…' : 'Carregar um cliente de exemplo'}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {state.clients.map(c => {
              const start = c.marcoZero.followers, now = currentFollowers(c);
              const series = [start, ...sortedMonths(c).map(m => m.followers)].filter(v => v != null);
              const lm = lastMonth(c);
              return (
                <article key={c.id} className={`${card} p-5 flex flex-col gap-4 hover:border-slate-300 hover:shadow-sm transition`}>
                  <div className="flex items-start gap-3">
                    <Avatar client={c} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900 truncate">{c.name}</h3>
                        {c.sample && <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 eyebrow shrink-0">Exemplo</span>}
                      </div>
                      <p className="text-sm text-slate-500 truncate">{c.niche}</p>
                      <p className="text-xs text-slate-400 truncate">@{c.handle}</p>
                    </div>
                  </div>
                  <div className="flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold text-slate-500 eyebrow">Seguidores</div>
                      <div className="text-lg font-semibold text-slate-900 tnum whitespace-nowrap">{fmtK(start)} <span className="text-slate-400">→</span> {fmtK(now)}</div>
                      <Delta value={growth(start, now)} className="mt-1" />
                    </div>
                    <Sparkline values={series} />
                  </div>
                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-500">{lm ? `Último mês: ${ymLabel(lm.ym)}` : 'Só Marco Zero'}</span>
                    <Link href={`${base}/cliente/${c.id}`} className={btnPrimary + ' !py-1.5'}>Abrir Painel</Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
        {mode === 'demo' && <p className="text-xs text-slate-400 mt-8">Na demonstração, os dados ficam salvos só neste navegador.</p>}
      </main>

      {modal && <ClientModal count={state.clients.length} onClose={() => setModal(false)} onSave={onSave} />}
    </div>
  );
}
