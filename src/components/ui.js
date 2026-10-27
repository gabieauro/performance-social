'use client';
import { useEffect, useState } from 'react';
import { fmt, fmtK, fmtPct, fmtPP, initials, parseNum } from '@/lib/format';

export { btnPrimary, btnAccent, btnGhost, card, th, td } from './styles';

const AVATAR_TONES = ['bg-slate-800 text-white', 'bg-emerald-600 text-white', 'bg-slate-200 text-slate-800', 'bg-emerald-100 text-emerald-800', 'bg-slate-600 text-white'];

export function Logo({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="w-8 h-8 rounded-lg bg-slate-900 grid place-items-center shrink-0" aria-hidden="true">
        <svg viewBox="0 0 20 20" width="18" height="18"><path d="M3 15 L8 9 L11 12 L17 5" fill="none" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
      <span className="font-semibold text-slate-900 tracking-tight">Performance Social</span>
    </span>
  );
}

export function Avatar({ client, size = 48 }) {
  const style = { width: size, height: size, fontSize: size * 0.36 };
  // eslint-disable-next-line @next/next/no-img-element
  if (client.photo) return <img src={client.photo} alt="" style={style} className="rounded-full object-cover ring-1 ring-slate-200 shrink-0" />;
  return <div style={style} className={`rounded-full grid place-items-center font-semibold shrink-0 ${AVATAR_TONES[(client.tone || 0) % AVATAR_TONES.length]}`}>{initials(client.name)}</div>;
}

export function Delta({ value, pp, className = '' }) {
  if (value == null || !isFinite(value)) return <span className={`text-slate-400 ${className}`}>—</span>;
  const tone = value > 0 ? 'text-emerald-700 bg-emerald-50 ring-emerald-200' : value < 0 ? 'text-rose-700 bg-rose-50 ring-rose-200' : 'text-slate-600 bg-slate-100 ring-slate-200';
  const arrow = value > 0 ? '▲' : value < 0 ? '▼' : '•';
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ring-1 tnum whitespace-nowrap ${tone} ${className}`}><span className="text-[9px]">{arrow}</span>{pp ? fmtPP(value) : fmtPct(value)}</span>;
}

export function NumCell({ value, onChange, editable, suffix = '', id }) {
  const [draft, setDraft] = useState(null);
  if (!editable) return <span className="tnum">{value == null ? '—' : fmt(value) + suffix}</span>;
  const shown = draft != null ? draft : (value == null ? '' : fmt(value) + suffix);
  return (
    <input id={id} className="cell-input" inputMode="decimal" value={shown} placeholder="—"
      onFocus={e => { const el = e.target; setDraft(value == null ? '' : String(value).replace('.', ',')); setTimeout(() => el.select(), 0); }}
      onChange={e => setDraft(e.target.value)}
      onBlur={() => { if (draft != null) { const n = parseNum(draft); if (n !== value) onChange(n); } setDraft(null); }}
      onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur(); if (e.key === 'Escape') { const el = e.currentTarget; setDraft(null); setTimeout(() => el.blur(), 0); } }} />
  );
}

export function ConfirmButton({ label, confirmLabel = 'Confirmar exclusão', onConfirm, className = '' }) {
  const [armed, setArmed] = useState(false);
  useEffect(() => { if (!armed) return; const t = setTimeout(() => setArmed(false), 3500); return () => clearTimeout(t); }, [armed]);
  return armed
    ? <button type="button" onClick={onConfirm} className={`text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-md px-2 py-1 ${className}`}>{confirmLabel}</button>
    : <button type="button" onClick={() => setArmed(true)} className={`text-xs font-medium text-slate-400 hover:text-rose-600 rounded-md px-2 py-1 ${className}`}>{label}</button>;
}

export function Sparkline({ values, width = 120, height = 36 }) {
  if (values.length < 2) return null;
  const min = Math.min(...values), max = Math.max(...values), span = max - min || 1;
  const pts = values.map((v, i) => [i / (values.length - 1) * (width - 4) + 2, height - 4 - (v - min) / span * (height - 8)]);
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const last = pts[pts.length - 1];
  const up = values[values.length - 1] >= values[0];
  const stroke = up ? '#059669' : '#e11d48';
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} aria-hidden="true">
      <path d={`${d} L ${last[0]} ${height} L ${pts[0][0]} ${height} Z`} fill={up ? 'rgba(5,150,105,.10)' : 'rgba(225,29,72,.08)'} />
      <path d={d} fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last[0]} cy={last[1]} r="3" fill={stroke} />
    </svg>
  );
}

function niceStep(raw) { const p = Math.pow(10, Math.floor(Math.log10(raw || 1))); const f = raw / p; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p; }

export function LineChart({ points, dark = false, height = 200, valueFmt = fmtK, label = 'Evolução de seguidores' }) {
  if (points.length < 2) return <div className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'} py-8 text-center`}>Adicione pelo menos um mês para ver a evolução.</div>;
  const W = 640, H = height, L = 48, R = 20, T = 20, B = 30;
  const vals = points.map(p => p.value);
  let min = Math.min(...vals), max = Math.max(...vals);
  if (min === max) { min -= 1; max += 1; }
  const step = niceStep((max - min) / 3);
  const lo = Math.floor(min / step) * step, hi = Math.ceil(max / step) * step;
  const ticks = []; for (let v = lo; v <= hi + step / 2; v += step) ticks.push(v);
  const x = i => L + i / (points.length - 1) * (W - L - R);
  const y = v => T + (1 - (v - lo) / (hi - lo)) * (H - T - B);
  const d = points.map((p, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(p.value).toFixed(1)).join(' ');
  const c = dark
    ? { grid: '#334155', text: '#94a3b8', line: '#34d399', fill: 'rgba(52,211,153,.16)', dot: '#0f172a', label: '#f1f5f9' }
    : { grid: '#e2e8f0', text: '#64748b', line: '#059669', fill: 'rgba(5,150,105,.10)', dot: '#ffffff', label: '#0f172a' };
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={label}>
      {ticks.map(t => (
        <g key={t}>
          <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke={c.grid} strokeDasharray="3 4" />
          <text x={L - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill={c.text} className="tnum">{valueFmt(t)}</text>
        </g>
      ))}
      <path d={`${d} L ${x(points.length - 1)} ${y(lo)} L ${x(0)} ${y(lo)} Z`} fill={c.fill} />
      <path d={d} fill="none" stroke={c.line} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => {
        const isLast = i === points.length - 1;
        return (
          <g key={i}>
            <circle cx={x(i)} cy={y(p.value)} r={isLast ? 5 : 3.5} fill={isLast ? c.line : c.dot} stroke={c.line} strokeWidth="2" />
            <text x={x(i)} y={H - 8} textAnchor={i === 0 ? 'start' : isLast ? 'end' : 'middle'} fontSize="11" fill={c.text}>{p.label}</text>
            {isLast && <text x={x(i) - 10} y={y(p.value) - 10} textAnchor="end" fontSize="12" fontWeight="600" fill={c.label} className="tnum">{valueFmt(p.value)}</text>}
          </g>
        );
      })}
    </svg>
  );
}

export function SectionTitle({ title, hint, children }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
      <div className="min-w-0">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {hint && <p className="text-sm text-slate-500 mt-0.5">{hint}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

export function CenterMessage({ title, children }) {
  return (
    <div className="gutter min-h-[60vh] grid place-items-center py-16">
      <div className="max-w-md text-center">
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
        <div className="text-sm text-slate-500 mt-2 grid gap-4 justify-items-center">{children}</div>
      </div>
    </div>
  );
}
