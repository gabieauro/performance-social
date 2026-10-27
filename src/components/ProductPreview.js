'use client';
import { SAMPLE_CARLOS } from '@/lib/sample';
import { fmt, fmtK, fmtPct, growth, monthLeads, sortedMonths, ymLabel } from '@/lib/format';
import { Avatar, Delta, LineChart } from './ui';

/** Recorte do painel real, com o cliente de exemplo, para a landing page. */
export default function ProductPreview() {
  const c = SAMPLE_CARLOS;
  const ms = sortedMonths(c);
  const cur = ms[ms.length - 1], prev = ms[ms.length - 2];
  const pts = [{ label: 'Início', value: c.marcoZero.followers }, ...ms.map(m => ({ label: ymLabel(m.ym), value: m.followers }))];
  const tiles = [
    ['Visualizações', cur.views, prev.views],
    ['Leads', monthLeads(cur), monthLeads(prev)],
    ['Contratos', cur.contracts, prev.contracts],
  ];
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_24px_60px_-24px_rgba(15,23,42,.25)] overflow-hidden" aria-label="Prévia do painel com cliente de exemplo">
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-slate-100 bg-slate-50">
        <span className="w-2.5 h-2.5 rounded-full bg-slate-300" /><span className="w-2.5 h-2.5 rounded-full bg-slate-300" /><span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
        <span className="ml-3 text-[11px] text-slate-400 truncate">Relatório de Performance · Outubro de 2026</span>
      </div>
      <div className="p-4 sm:p-5 grid gap-4">
        <div className="flex items-center gap-3">
          <Avatar client={c} size={40} />
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-slate-900 text-sm truncate">{c.name}</div>
            <div className="text-xs text-slate-500 truncate">{c.niche} · @{c.handle}</div>
          </div>
          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 eyebrow">Exemplo</span>
        </div>
        <div className="rounded-xl bg-slate-900 text-white p-4 grid gap-3 sm:grid-cols-[9rem_1fr] items-center">
          <div>
            <div className="text-[10px] font-semibold text-slate-400 eyebrow">Seguidores</div>
            <div className="text-2xl font-semibold tnum mt-1">{fmtK(cur.followers)}</div>
            <div className="mt-1.5 inline-flex rounded-full bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30 px-2 py-0.5 text-[11px] font-semibold tnum">
              {fmtPct(growth(c.marcoZero.followers, cur.followers))} desde o início
            </div>
          </div>
          <div className="min-w-0"><LineChart points={pts} dark height={150} /></div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {tiles.map(([label, v, p]) => (
            <div key={label} className="rounded-lg border border-slate-200 p-3 min-w-0">
              <div className="text-[11px] text-slate-500 truncate">{label}</div>
              <div className="text-lg font-semibold text-slate-900 tnum">{fmt(v)}</div>
              <Delta value={growth(p, v)} className="mt-1 !text-[10px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
