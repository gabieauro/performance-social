'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { currentFollowers, fmtK, growth, sortedMonths, ymLong } from '@/lib/format';
import { useWorkspace, SaveIndicator } from './workspace';
import { Avatar, CenterMessage, ConfirmButton, Delta, Logo, btnGhost, btnPrimary } from './ui';
import { ContentTab, ExecTab, LeadsTab, MarcoZeroTab, MonthlyTab } from './tabs';

const TABS = [
  ['marco', 'Marco Zero'], ['mensal', 'Acompanhamento Mensal'], ['conteudos', 'Conteúdos'], ['leads', 'Leads e Conversão'], ['executivo', 'Dashboard Executivo'],
];

/** Visual do painel: usado pela gestora (editável) e pelo link público do cliente (leitura). */
export function ClientPanelView({ client, gestora, update, editable, clientMode, tab, setTab, monthId, setMonthId }) {
  const ms = sortedMonths(client);
  const reportMonth = ms.find(m => m.id === monthId) || ms[ms.length - 1];
  const props = { client, update, editable };

  return (
    <div className="gutter max-w-6xl mx-auto py-8">
      <div className={`flex flex-wrap items-center gap-4 ${clientMode ? 'pb-6 mb-6 border-b border-slate-200' : 'mb-6'}`}>
        <Avatar client={client} size={clientMode ? 64 : 56} />
        <div className="min-w-0 flex-1">
          {clientMode && <p className="text-xs font-semibold text-emerald-700 eyebrow mb-1">Relatório de Performance · {reportMonth ? ymLong(reportMonth.ym) : 'Marco Zero'}</p>}
          <h1 className={`${clientMode ? 'text-3xl' : 'text-2xl'} font-semibold text-slate-900 tracking-tight`}>{client.name}</h1>
          <p className="text-sm text-slate-500">{client.niche} · @{client.handle}</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500">Seguidores desde o início</div>
          <div className="text-lg font-semibold tnum text-slate-900">{fmtK(client.marcoZero.followers)} → {fmtK(currentFollowers(client))}</div>
          <Delta value={growth(client.marcoZero.followers, currentFollowers(client))} />
        </div>
      </div>

      <nav className="scroll-x -mx-1 mb-6" aria-label="Seções do painel">
        <div className="flex gap-1 px-1 border-b border-slate-200 min-w-max">
          {TABS.map(([k, label], n) => (
            <button key={k} type="button" onClick={() => setTab(k)} aria-current={tab === k ? 'page' : undefined}
              className={`relative px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${tab === k ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}>
              <span className="tnum text-slate-400 mr-1.5 text-xs">{String(n + 1).padStart(2, '0')}</span>{label}
              {tab === k && <span className="absolute left-2 right-2 -bottom-px h-0.5 bg-emerald-600 rounded-full" />}
            </button>
          ))}
        </div>
      </nav>

      <div key={tab} className="fade-in">
        {tab === 'marco' && <MarcoZeroTab {...props} />}
        {tab === 'mensal' && <MonthlyTab {...props} />}
        {tab === 'conteudos' && <ContentTab {...props} />}
        {tab === 'leads' && <LeadsTab {...props} />}
        {tab === 'executivo' && <ExecTab {...props} monthId={reportMonth && reportMonth.id} setMonthId={setMonthId} />}
      </div>

      {clientMode && (
        <footer className="mt-10 pt-5 border-t border-slate-200 flex flex-wrap justify-between gap-2 text-xs text-slate-500">
          <span>Relatório preparado por <span className="font-medium text-slate-700">{gestora}</span></span>
          <Logo className="scale-90 origin-right" />
        </footer>
      )}
    </div>
  );
}

function SharePanel({ client, onClose }) {
  const { setShare, mode } = useWorkspace();
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const url = client.shareToken ? `${window.location.origin}/r/${client.shareToken}` : '';

  const toggle = async enabled => {
    setBusy(true); setError('');
    try { await setShare(client.id, enabled); } catch (e) { setError(e.message || String(e)); }
    setBusy(false);
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch (e) { document.getElementById('share-url')?.select(); }
  };

  return (
    <div className="absolute right-0 top-full mt-2 z-30 w-[min(24rem,calc(100vw-32px))] rounded-xl border border-slate-200 bg-white shadow-lg p-4 text-left">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-900">Link do relatório</h2>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 leading-none" aria-label="Fechar">×</button>
      </div>
      <p className="text-xs text-slate-500 mt-1">Quem tiver o link vê o painel deste cliente em modo leitura, sem precisar de conta. Mande direto no WhatsApp.</p>
      {mode === 'demo' && <p className="text-xs text-amber-700 bg-amber-50 rounded-md px-2 py-1.5 mt-2">Na demonstração, o link só abre neste navegador.</p>}
      {client.shareToken ? (
        <div className="mt-3 grid gap-2">
          <input id="share-url" readOnly value={url} className="text-input text-xs !py-1.5" onFocus={e => e.target.select()} />
          <div className="flex flex-wrap gap-2">
            <button type="button" className={btnPrimary + ' !py-1.5'} onClick={copy}>{copied ? 'Link copiado' : 'Copiar link'}</button>
            <a href={url} target="_blank" rel="noreferrer" className={btnGhost + ' !py-1.5'}>Abrir</a>
            <button type="button" disabled={busy} className="ml-auto text-xs text-slate-500 hover:text-rose-600" onClick={() => toggle(false)}>Desativar link</button>
          </div>
        </div>
      ) : (
        <button type="button" disabled={busy} className={btnPrimary + ' mt-3 w-full'} onClick={() => toggle(true)}>{busy ? 'Criando…' : 'Criar link do relatório'}</button>
      )}
      {error && <p className="text-xs text-rose-600 mt-2">{error}</p>}
    </div>
  );
}

/** Página do cliente dentro do app da gestora. */
export default function ClientPage({ id, initialTab }) {
  const { state, base, updateClient, deleteClient } = useWorkspace();
  const router = useRouter();
  const [tab, setTab] = useState(TABS.some(([k]) => k === initialTab) ? initialTab : 'executivo');
  const [clientMode, setClientMode] = useState(false);
  const [monthId, setMonthId] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const client = state.clients.find(c => c.id === id);

  if (!client) return (
    <CenterMessage title="Cliente não encontrado">
      <p>Ele pode ter sido excluído.</p>
      <Link href={base} className={btnPrimary}>Voltar para Meus Clientes</Link>
    </CenterMessage>
  );

  const update = fn => updateClient(id, fn);
  const onDelete = async () => { await deleteClient(id); router.push(base); };

  return (
    <div className="fade-in">
      {!clientMode ? (
        <header className="bg-white border-b border-slate-200">
          <div className="gutter max-w-6xl mx-auto py-3 flex flex-wrap items-center gap-3">
            <Link href={base} className="text-sm text-slate-500 hover:text-slate-900 font-medium">← Meus Clientes</Link>
            <span className="text-slate-300">/</span>
            <span className="text-sm font-medium text-slate-900 truncate min-w-0">{client.name}</span>
            <SaveIndicator />
            <div className="ml-auto flex flex-wrap items-center gap-2">
              <ConfirmButton label="Excluir cliente" confirmLabel="Excluir cliente e dados" onConfirm={onDelete} />
              <div className="relative">
                <button type="button" className={btnGhost} onClick={() => setShareOpen(o => !o)} aria-expanded={shareOpen}>
                  {client.shareToken ? 'Link ativo' : 'Compartilhar'}
                </button>
                {shareOpen && <SharePanel client={client} onClose={() => setShareOpen(false)} />}
              </div>
              <button type="button" className={btnPrimary} onClick={() => { setClientMode(true); setTab('executivo'); setShareOpen(false); window.scrollTo(0, 0); }}>
                <span aria-hidden="true">👁️</span> Ver como Cliente
              </button>
            </div>
          </div>
        </header>
      ) : (
        <div className="bg-slate-900 h-1.5" />
      )}

      <ClientPanelView client={client} gestora={state.gestora} update={update} editable={!clientMode}
        clientMode={clientMode} tab={tab} setTab={setTab} monthId={monthId} setMonthId={setMonthId} />

      {clientMode && (
        <button type="button" onClick={() => setClientMode(false)}
          className="fixed z-40 rounded-full bg-white/90 backdrop-blur border border-slate-200 shadow-sm px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
          style={{ right: 'calc(16px + env(safe-area-inset-right, 0px))', bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}>
          Sair do modo cliente
        </button>
      )}
    </div>
  );
}
