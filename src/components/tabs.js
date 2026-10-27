'use client';
import { useState } from 'react';
import {
  CLASSIFICACOES, FORMATOS, addMonthTo, dateBR, emptyAnalysis, fmt, fmtK, fmtPct, fmtRate, growth,
  monthLeads, parseNum, ratio, sortedMonths, todayISO, uid, ymLabel, ymLong,
} from '@/lib/format';
import { ConfirmButton, Delta, LineChart, NumCell, SectionTitle, btnPrimary, card, td, th } from './ui';

/* ---------- 01 Marco Zero ---------- */
const MZ_ROWS = [
  ['date', 'Data de início', 'Quando a gestão começou'],
  ['followers', 'Seguidores iniciais', 'Base para todo cálculo de crescimento'],
  ['reach', 'Alcance pré-gestão', 'Contas alcançadas nos 30 dias anteriores'],
  ['views', 'Visualizações', 'Visualizações nos 30 dias anteriores'],
  ['nonFollowersPct', 'Não seguidores (%)', 'Parcela do alcance vinda de quem não segue'],
  ['interactions', 'Interações', 'Curtidas, comentários, salvamentos e compartilhamentos'],
  ['profileVisits', 'Visitas ao perfil', 'Nos 30 dias anteriores'],
  ['linkClicks', 'Cliques no link', 'Toques no link da bio'],
  ['leads', 'Leads', 'Contatos recebidos no WhatsApp e direct'],
];

export function MarcoZeroTab({ client, update, editable }) {
  const mz = client.marcoZero;
  return (
    <section>
      <SectionTitle title="Marco Zero" hint="O ponto de partida do perfil antes da gestão. Todo crescimento é medido a partir daqui." />
      <div className={`${card} overflow-hidden max-w-3xl`}>
        <table className="w-full">
          <tbody>
            {MZ_ROWS.map(([k, label, hint], i) => (
              <tr key={k} className={i ? 'border-t border-slate-100' : ''}>
                <th scope="row" className="px-4 py-3 text-left align-middle">
                  <div className="text-sm font-medium text-slate-800">{label}</div>
                  <div className="text-xs text-slate-400 font-normal">{hint}</div>
                </th>
                <td className="px-4 py-3 text-right w-44 text-sm font-semibold text-slate-900">
                  {k === 'date'
                    ? (editable ? <input id="mz-date" type="date" className="text-input !py-1 text-right" value={mz.date || ''} onChange={e => update(c => { c.marcoZero.date = e.target.value; })} /> : dateBR(mz.date))
                    : <NumCell id={`mz-${k}`} editable={editable} value={mz[k]} suffix={k === 'nonFollowersPct' ? '%' : ''} onChange={v => update(c => { c.marcoZero[k] = v; })} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editable && <p className="text-xs text-slate-500 mt-3">Clique em qualquer número para corrigir. Aceita formatos como 24.500, 24500 ou 24,5k.</p>}
    </section>
  );
}

/* ---------- 02 Acompanhamento Mensal ---------- */
const MONTH_ROWS = [
  { key: 'followers', label: 'Seguidores' },
  { key: 'views', label: 'Visualizações' },
  { key: 'nonFollowersPct', label: 'Não seguidores (%)', pct: true },
  { key: 'interactions', label: 'Interações' },
  { key: 'profileVisits', label: 'Visitas ao perfil' },
  { key: 'leads', label: 'Leads', computed: true },
];
const pointVal = (p, key, isStart) => key === 'leads' && !isStart ? monthLeads(p) : p[key];

export function MonthlyTab({ client, update, editable }) {
  const ms = sortedMonths(client);
  const mz = client.marcoZero;
  const last = ms[ms.length - 1];
  const chartPts = [{ label: 'Início', value: mz.followers }, ...ms.map(m => ({ label: ymLabel(m.ym), value: m.followers }))].filter(p => p.value != null);
  return (
    <section>
      <SectionTitle title="Acompanhamento Mensal" hint="Mês a mês, comparado ao Marco Zero.">
        {editable && <button type="button" className={btnPrimary} onClick={() => update(c => { addMonthTo(c); })}>+ Adicionar mês</button>}
      </SectionTitle>
      <div className={`${card} scroll-x`}>
        <table className="w-full min-w-[640px]">
          <thead className="bg-slate-50">
            <tr>
              <th className={th + ' sticky left-0 bg-slate-50'}>Métrica</th>
              <th className={th + ' text-right'}>Início<div className="normal-case tracking-normal font-normal text-slate-400">{dateBR(mz.date).slice(3)}</div></th>
              {ms.map(m => (
                <th key={m.id} className={th + ' text-right'}>
                  {editable
                    ? <input id={`ym-${m.id}`} type="month" value={m.ym} className="bg-transparent text-right text-[11px] font-semibold text-slate-600 w-[7.5rem]" onChange={e => e.target.value && update(c => { c.months.find(x => x.id === m.id).ym = e.target.value; })} />
                    : ymLabel(m.ym)}
                  {editable && <div><ConfirmButton label="remover" confirmLabel="Remover?" className="!px-1 !py-0 normal-case tracking-normal" onConfirm={() => update(c => { c.months = c.months.filter(x => x.id !== m.id); })} /></div>}
                </th>
              ))}
              <th className={th + ' text-right bg-emerald-50 text-emerald-800'}>Crescimento total</th>
            </tr>
          </thead>
          <tbody>
            {MONTH_ROWS.map(row => {
              const startV = mz[row.key];
              const endV = last ? pointVal(last, row.key, false) : null;
              const total = row.pct ? (startV != null && endV != null ? endV - startV : null) : growth(startV, endV);
              return (
                <tr key={row.key}>
                  <th scope="row" className={td + ' font-medium text-left sticky left-0 bg-white whitespace-nowrap'}>{row.label}</th>
                  <td className={td + ' text-right text-slate-500 tnum'}>{startV == null ? '—' : fmt(startV) + (row.pct ? '%' : '')}</td>
                  {ms.map(m => (
                    <td key={m.id} className={td + ' text-right'}>
                      {row.computed
                        ? <span className="tnum" title="Soma de WhatsApp e direct, editável na aba Leads e Conversão">{fmt(monthLeads(m))}</span>
                        : <NumCell id={`m-${m.id}-${row.key}`} editable={editable} value={m[row.key]} suffix={row.pct ? '%' : ''} onChange={v => update(c => { c.months.find(x => x.id === m.id)[row.key] = v; })} />}
                    </td>
                  ))}
                  <td className={td + ' text-right bg-emerald-50/50'}><Delta value={total} pp={row.pct} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {ms.length === 0 && <p className="text-sm text-slate-500 mt-3">Nenhum mês registrado ainda. {editable && 'Use "Adicionar mês" para começar.'}</p>}
      {editable && ms.length > 0 && <p className="text-xs text-slate-500 mt-3">Leads somam WhatsApp e direct e são editados na aba Leads e Conversão. Não seguidores mostra a variação em pontos percentuais (p.p.).</p>}
      <div className={`${card} p-5 mt-6`}>
        <div className="flex items-baseline justify-between gap-3 mb-2">
          <h3 className="text-sm font-semibold text-slate-900">Evolução de seguidores</h3>
          <Delta value={growth(mz.followers, last ? last.followers : null)} />
        </div>
        <LineChart points={chartPts} />
      </div>
    </section>
  );
}

/* ---------- 03 Conteúdos ---------- */
export function ContentTab({ client, update, editable }) {
  const [filter, setFilter] = useState('all');
  const blank = { date: todayISO(), title: '', format: 'Reels', classification: 'Alcance', reach: '', notes: '' };
  const [draft, setDraft] = useState(blank);
  const [err, setErr] = useState('');
  const months = Array.from(new Set(client.posts.map(p => p.date.slice(0, 7)))).sort().reverse();
  const posts = client.posts.filter(p => filter === 'all' || p.date.startsWith(filter)).sort((a, b) => b.date.localeCompare(a.date));
  const counts = Object.keys(CLASSIFICACOES).map(k => [k, posts.filter(p => p.classification === k).length]);
  const add = e => {
    e.preventDefault();
    if (!draft.title.trim()) return setErr('Dê um tema ou título ao post.');
    update(c => { c.posts.push({ id: uid(), ...draft, title: draft.title.trim(), reach: parseNum(draft.reach) }); });
    setDraft({ ...blank, date: draft.date, format: draft.format }); setErr('');
  };
  const setP = (id, k, v) => update(c => { c.posts.find(p => p.id === id)[k] = v; });

  return (
    <section>
      <SectionTitle title="Conteúdos" hint="Os melhores posts do mês e o papel de cada um na estratégia." />
      <div className="flex flex-wrap gap-2 mb-4">
        {[['all', 'Todos'], ...months.map(m => [m, ymLabel(m)])].map(([k, l]) => (
          <button key={k} type="button" onClick={() => setFilter(k)} className={`rounded-full px-3 py-1 text-sm font-medium border ${filter === k ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}>{l}</button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {counts.map(([k, n]) => (
          <span key={k} className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ring-1 ${CLASSIFICACOES[k]}`}>{k}<span className="tnum font-semibold">{n}</span></span>
        ))}
      </div>

      {editable && (
        <form onSubmit={add} className={`${card} p-4 mb-4 grid gap-3 md:grid-cols-12 items-end`}>
          <div className="md:col-span-2"><label htmlFor="np-data" className="text-xs font-medium text-slate-600">Data</label><input id="np-data" type="date" className="text-input mt-1" value={draft.date} onChange={e => setDraft({ ...draft, date: e.target.value })} /></div>
          <div className="md:col-span-4"><label htmlFor="np-tema" className="text-xs font-medium text-slate-600">Tema / título</label><input id="np-tema" className="text-input mt-1" placeholder="Ex.: Horas extras no home office" value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} /></div>
          <div className="md:col-span-2"><label htmlFor="np-formato" className="text-xs font-medium text-slate-600">Formato</label><select id="np-formato" className="text-input mt-1" value={draft.format} onChange={e => setDraft({ ...draft, format: e.target.value })}>{FORMATOS.map(f => <option key={f}>{f}</option>)}</select></div>
          <div className="md:col-span-2"><label htmlFor="np-class" className="text-xs font-medium text-slate-600">Classificação</label><select id="np-class" className="text-input mt-1" value={draft.classification} onChange={e => setDraft({ ...draft, classification: e.target.value })}>{Object.keys(CLASSIFICACOES).map(f => <option key={f}>{f}</option>)}</select></div>
          <div className="md:col-span-2"><label htmlFor="np-alcance" className="text-xs font-medium text-slate-600">Alcance</label><input id="np-alcance" className="text-input mt-1 tnum" inputMode="decimal" placeholder="Ex.: 12.300" value={draft.reach} onChange={e => setDraft({ ...draft, reach: e.target.value })} /></div>
          <div className="md:col-span-10"><label htmlFor="np-obs" className="text-xs font-medium text-slate-600">Observações</label><input id="np-obs" className="text-input mt-1" placeholder="O que fez esse post funcionar?" value={draft.notes} onChange={e => setDraft({ ...draft, notes: e.target.value })} /></div>
          <div className="md:col-span-2"><button type="submit" className={btnPrimary + ' w-full'}>+ Adicionar post</button></div>
          {err && <p className="md:col-span-12 text-sm text-rose-600">{err}</p>}
        </form>
      )}

      <div className={`${card} scroll-x`}>
        <table className="w-full min-w-[760px]">
          <thead className="bg-slate-50"><tr>
            <th className={th}>Data</th><th className={th}>Tema / título</th><th className={th}>Formato</th><th className={th}>Classificação</th><th className={th + ' text-right'}>Alcance</th><th className={th}>Observações</th>{editable && <th className={th}><span className="sr-only">Ações</span></th>}
          </tr></thead>
          <tbody>
            {posts.length === 0 && <tr><td colSpan={7} className={td + ' text-center text-slate-500 py-8'}>Nenhum post registrado neste período.</td></tr>}
            {posts.map(p => (
              <tr key={p.id} className="align-top">
                <td className={td + ' whitespace-nowrap tnum text-slate-500'}>{dateBR(p.date)}</td>
                <td className={td + ' font-medium min-w-[14rem]'}>{p.title}</td>
                <td className={td}>
                  {editable ? <select id={`pf-${p.id}`} className="bg-transparent text-sm" value={p.format} onChange={e => setP(p.id, 'format', e.target.value)}>{FORMATOS.map(f => <option key={f}>{f}</option>)}</select>
                    : <span className="text-slate-600">{p.format}</span>}
                </td>
                <td className={td}>
                  {editable
                    ? <select id={`pc-${p.id}`} className={`rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ${CLASSIFICACOES[p.classification]}`} value={p.classification} onChange={e => setP(p.id, 'classification', e.target.value)}>{Object.keys(CLASSIFICACOES).map(f => <option key={f}>{f}</option>)}</select>
                    : <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-medium ring-1 ${CLASSIFICACOES[p.classification]}`}>{p.classification}</span>}
                </td>
                <td className={td + ' text-right font-semibold'}><NumCell id={`pr-${p.id}`} editable={editable} value={p.reach} onChange={v => setP(p.id, 'reach', v)} /></td>
                <td className={td + ' text-slate-600 min-w-[14rem]'}>{p.notes || <span className="text-slate-300">—</span>}</td>
                {editable && <td className={td + ' text-right'}><ConfirmButton label="Excluir" confirmLabel="Excluir?" onConfirm={() => update(c => { c.posts = c.posts.filter(x => x.id !== p.id); })} /></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ---------- 04 Leads e Conversão ---------- */
export function LeadsTab({ client, update, editable }) {
  const ms = sortedMonths(client);
  const set = (id, k, v) => update(c => { c.months.find(x => x.id === id)[k] = v; });
  const tot = ms.reduce((a, m) => ({ clicks: a.clicks + (m.linkClicks || 0), leads: a.leads + monthLeads(m), contracts: a.contracts + (m.contracts || 0) }), { clicks: 0, leads: 0, contracts: 0 });
  const funnel = [
    ['Cliques no link da bio', tot.clicks, null],
    ['Leads (WhatsApp + direct)', tot.leads, ratio(tot.leads, tot.clicks)],
    ['Contratos fechados', tot.contracts, ratio(tot.contracts, tot.leads)],
  ];
  const mz = client.marcoZero;
  return (
    <section>
      <SectionTitle title="Leads e Conversão" hint="Do tráfego orgânico ao contrato assinado, mês a mês.">
        {editable && <button type="button" className={btnPrimary} onClick={() => update(c => { addMonthTo(c); })}>+ Adicionar mês</button>}
      </SectionTitle>

      <div className={`${card} p-5 mb-6`}>
        <h3 className="text-sm font-semibold text-slate-900">Funil acumulado desde o início da gestão</h3>
        <p className="text-xs text-slate-500 mb-4">Soma de {ms.length} {ms.length === 1 ? 'mês' : 'meses'}. Marco Zero: {fmt(mz.linkClicks)} cliques e {fmt(mz.leads)} leads por mês.</p>
        <div className="grid gap-3">
          {funnel.map(([label, v, rate], i) => (
            <div key={label} className="grid grid-cols-[minmax(0,9rem)_1fr] sm:grid-cols-[14rem_1fr] items-center gap-3">
              <div className="text-sm text-slate-600 min-w-0">{label}</div>
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-7 rounded-md bg-slate-100 flex-1 overflow-hidden">
                  <div className={`h-full rounded-md ${i === 2 ? 'bg-emerald-600' : i === 1 ? 'bg-slate-700' : 'bg-slate-400'}`} style={{ width: `${Math.max(2, tot.clicks ? v / tot.clicks * 100 : 0)}%` }} />
                </div>
                <div className="w-24 text-right shrink-0">
                  <div className="text-sm font-semibold text-slate-900 tnum">{fmt(v)}</div>
                  {rate != null && <div className="text-[11px] text-slate-500 tnum">{fmtRate(rate)} da etapa anterior</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`${card} scroll-x`}>
        <table className="w-full min-w-[760px]">
          <thead className="bg-slate-50"><tr>
            <th className={th}>Mês</th><th className={th + ' text-right'}>Cliques no link</th><th className={th + ' text-right'}>Leads WhatsApp</th><th className={th + ' text-right'}>Leads direct</th><th className={th + ' text-right'}>Total de leads</th><th className={th + ' text-right'}>Contratos</th><th className={th + ' text-right'}>Clique → lead</th><th className={th + ' text-right'}>Lead → contrato</th>
          </tr></thead>
          <tbody>
            <tr className="bg-slate-50/60">
              <td className={td + ' text-slate-500'}>Marco Zero</td>
              <td className={td + ' text-right tnum text-slate-500'}>{fmt(mz.linkClicks)}</td>
              <td className={td + ' text-right text-slate-400'} colSpan={2}>—</td>
              <td className={td + ' text-right tnum text-slate-500'}>{fmt(mz.leads)}</td>
              <td className={td + ' text-right text-slate-400'}>—</td>
              <td className={td + ' text-right tnum text-slate-500'}>{fmtRate(ratio(mz.leads, mz.linkClicks))}</td>
              <td className={td + ' text-right text-slate-400'}>—</td>
            </tr>
            {ms.map(m => {
              const leads = monthLeads(m);
              return (
                <tr key={m.id}>
                  <td className={td + ' font-medium whitespace-nowrap'}>{ymLabel(m.ym)}</td>
                  {['linkClicks', 'leadsWhatsapp', 'leadsDirect'].map(k => <td key={k} className={td + ' text-right'}><NumCell id={`l-${m.id}-${k}`} editable={editable} value={m[k]} onChange={v => set(m.id, k, v)} /></td>)}
                  <td className={td + ' text-right font-semibold tnum'}>{fmt(leads)}</td>
                  <td className={td + ' text-right font-semibold text-emerald-700'}><NumCell id={`l-${m.id}-contracts`} editable={editable} value={m.contracts} onChange={v => set(m.id, 'contracts', v)} /></td>
                  <td className={td + ' text-right tnum'}>{fmtRate(ratio(leads, m.linkClicks))}</td>
                  <td className={td + ' text-right tnum'}>{fmtRate(ratio(m.contracts, leads))}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {ms.length === 0 && <p className="text-sm text-slate-500 mt-3">Nenhum mês registrado ainda.</p>}
    </section>
  );
}

/* ---------- 05 Dashboard Executivo ---------- */
export function ExecTab({ client, update, editable, monthId, setMonthId }) {
  const ms = sortedMonths(client);
  const mz = client.marcoZero;
  if (ms.length === 0) return (
    <section className={`${card} p-10 text-center`}>
      <h2 className="text-lg font-semibold text-slate-900">Ainda não há mês fechado</h2>
      <p className="text-sm text-slate-500 mt-1">O dashboard executivo aparece quando o primeiro mês é registrado no Acompanhamento Mensal.</p>
      {editable && <button type="button" className={btnPrimary + ' mt-5'} onClick={() => update(c => { addMonthTo(c); })}>+ Adicionar primeiro mês</button>}
    </section>
  );
  const found = ms.findIndex(m => m.id === monthId);
  const i = found >= 0 ? found : ms.length - 1;
  const cur = ms[i];
  const prev = i > 0 ? ms[i - 1] : { ...mz, leadsWhatsapp: mz.leads, leadsDirect: 0, contracts: null };
  const prevLabel = i > 0 ? ymLabel(ms[i - 1].ym) : 'Marco Zero';
  const tiles = [
    ['Visualizações', cur.views, prev.views],
    ['Interações', cur.interactions, prev.interactions],
    ['Visitas ao perfil', cur.profileVisits, prev.profileVisits],
    ['Cliques no link', cur.linkClicks, prev.linkClicks],
    ['Leads', monthLeads(cur), monthLeads(prev)],
    ['Contratos fechados', cur.contracts, prev.contracts],
  ];
  const topPosts = client.posts.filter(p => p.date.startsWith(cur.ym)).sort((a, b) => (b.reach || 0) - (a.reach || 0)).slice(0, 3);
  const pts = [{ label: 'Início', value: mz.followers }, ...ms.slice(0, i + 1).map(m => ({ label: ymLabel(m.ym), value: m.followers }))].filter(p => p.value != null);
  const setA = (k, v) => update(c => { const m = c.months.find(x => x.id === cur.id); m.analysis = { ...(m.analysis || emptyAnalysis()), [k]: v }; });
  const a = cur.analysis || emptyAnalysis();
  const monthDiff = (cur.followers || 0) - (prev.followers || 0);
  const qs = [
    ['grew', 'O que cresceu?', 'Os números e conteúdos que puxaram o mês.'],
    ['learned', 'O que aprendemos?', 'Padrões que se repetiram nos posts que funcionaram.'],
    ['test', 'O que vamos testar no próximo mês?', 'Formatos, temas ou chamadas para validar.'],
  ];

  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-emerald-700 eyebrow">Relatório do mês</p>
          <h2 className="text-xl font-semibold text-slate-900 mt-1">{ymLong(cur.ym)}</h2>
        </div>
        {setMonthId && ms.length > 1 && (
          <div className="flex items-center gap-2">
            <label htmlFor="exec-mes" className="text-sm text-slate-500">Mês do relatório</label>
            <select id="exec-mes" className="text-input !w-auto !py-1.5" value={cur.id} onChange={e => setMonthId(e.target.value)}>
              {[...ms].reverse().map(m => <option key={m.id} value={m.id}>{ymLabel(m.ym)}</option>)}
            </select>
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-slate-900 text-white p-6 grid gap-6 lg:grid-cols-[minmax(0,18rem)_1fr] items-center">
        <div className="min-w-0">
          <div className="text-xs font-semibold text-slate-400 eyebrow">Seguidores</div>
          <div className="text-4xl font-semibold tnum mt-2 tracking-tight">{fmt(cur.followers)}</div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-300">
            <span className="tnum">{fmtK(mz.followers)} → {fmtK(cur.followers)}</span>
            <span className="rounded-full bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30 px-2 py-0.5 text-xs font-semibold tnum">{fmtPct(growth(mz.followers, cur.followers))} desde o início</span>
          </div>
          <div className="mt-2 text-sm text-slate-400">No mês: <span className={`font-semibold tnum ${monthDiff >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{monthDiff >= 0 ? '+' : ''}{fmt(monthDiff)}</span> vs. {prevLabel}</div>
          <div className="mt-4 text-sm text-slate-400">Não seguidores alcançados: <span className="text-white font-semibold tnum">{cur.nonFollowersPct == null ? '—' : fmt(cur.nonFollowersPct) + '%'}</span></div>
        </div>
        <div className="min-w-0"><LineChart points={pts} dark height={190} /></div>
      </div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-3">
        {tiles.map(([label, v, p]) => (
          <div key={label} className={`${card} p-4 min-w-0`}>
            <div className="text-xs font-medium text-slate-500">{label}</div>
            <div className={`text-2xl font-semibold tnum mt-1 ${label === 'Contratos fechados' ? 'text-emerald-700' : 'text-slate-900'}`}>{fmt(v)}</div>
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-slate-500"><Delta value={growth(p, v)} /><span>vs. {prevLabel}</span></div>
          </div>
        ))}
      </div>

      <div className={`${card} p-5`}>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Destaques de conteúdo</h3>
        {topPosts.length === 0 ? <p className="text-sm text-slate-500">Nenhum post registrado em {ymLabel(cur.ym)}.</p> : (
          <ol className="grid gap-3 md:grid-cols-3">
            {topPosts.map((p, n) => (
              <li key={p.id} className="rounded-lg border border-slate-100 bg-slate-50 p-4 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-400 tnum">#{n + 1} em alcance</span>
                  <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ${CLASSIFICACOES[p.classification]}`}>{p.classification}</span>
                </div>
                <div className="font-medium text-slate-900 mt-2 text-sm">{p.title}</div>
                <div className="text-xs text-slate-500 mt-1">{p.format} · {dateBR(p.date)}</div>
                <div className="text-lg font-semibold text-slate-900 tnum mt-2">{fmt(p.reach)} <span className="text-xs font-normal text-slate-500">contas alcançadas</span></div>
                {p.notes && <p className="text-xs text-slate-600 mt-1">{p.notes}</p>}
              </li>
            ))}
          </ol>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Rotina de Análise Mensal</h3>
        <div className="grid gap-3 md:grid-cols-3">
          {qs.map(([k, q, hint], n) => (
            <div key={k} className={`${card} p-4 flex flex-col min-w-0`}>
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-semibold text-emerald-700 tnum">{n + 1}.</span>
                <span className="text-sm font-semibold text-slate-900">{q}</span>
              </div>
              {editable
                ? <textarea id={`an-${cur.id}-${k}`} rows={6} className="text-input mt-3 text-sm leading-relaxed resize-y flex-1" placeholder={hint} value={a[k] || ''} onChange={e => setA(k, e.target.value)} />
                : <p className={`mt-3 text-sm leading-relaxed whitespace-pre-line ${a[k] ? 'text-slate-700' : 'text-slate-400'}`}>{a[k] || 'Ainda não preenchido.'}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
