export const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
export const MESES_LONGOS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export const ymLabel = ym => { const [y, m] = ym.split('-'); return `${MESES[+m - 1]}/${y.slice(2)}`; };
export const ymLong = ym => { const [y, m] = ym.split('-'); return `${MESES_LONGOS[+m - 1]} de ${y}`; };
export const dateBR = iso => { if (!iso) return '—'; const [y, m, d] = iso.split('-'); return `${d}/${m}/${y}`; };
export const nextYm = ym => { let [y, m] = ym.split('-').map(Number); m++; if (m > 12) { m = 1; y++; } return `${y}-${String(m).padStart(2, '0')}`; };
export const todayISO = () => new Date().toISOString().slice(0, 10);

export const uid = () => Math.random().toString(36).slice(2, 10);
export function randomToken() {
  const bytes = new Uint8Array(18);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(36).padStart(2, '0')).join('').slice(0, 28);
}
export const clone = o => JSON.parse(JSON.stringify(o));

const nf = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });
export const fmt = n => (n == null || isNaN(n)) ? '—' : nf.format(n);
export const fmtK = n => (n == null || isNaN(n)) ? '—' : Math.abs(n) >= 1000 ? (n / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + 'k' : fmt(n);
export const growth = (a, b) => (a == null || b == null || a === 0) ? null : (b - a) / a * 100;
export const fmtPct = p => p == null || !isFinite(p) ? '—' : (p > 0 ? '+' : '') + p.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%';
export const fmtPP = p => p == null ? '—' : (p > 0 ? '+' : '') + p.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' p.p.';
export const ratio = (a, b) => (!b || a == null) ? null : a / b * 100;
export const fmtRate = r => r == null ? '—' : r.toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%';

export function parseNum(s) {
  if (s == null) return null;
  let t = String(s).trim().toLowerCase().replace(/\s|%/g, '');
  if (!t) return null;
  let mult = 1;
  if (t.endsWith('k')) { mult = 1000; t = t.slice(0, -1); }
  if (t.includes(',')) t = t.replace(/\./g, '').replace(',', '.');
  else if (/^\d{1,3}(\.\d{3})+$/.test(t)) t = t.replace(/\./g, '');
  const n = parseFloat(t);
  return isNaN(n) ? null : Math.round(n * mult * 10) / 10;
}

export const monthLeads = m => (m.leadsWhatsapp || 0) + (m.leadsDirect || 0);
export const sortedMonths = c => [...(c.months || [])].sort((a, b) => a.ym.localeCompare(b.ym));
export const lastMonth = c => { const s = sortedMonths(c); return s[s.length - 1] || null; };
export const currentFollowers = c => { const l = lastMonth(c); return l ? l.followers : c.marcoZero.followers; };
export const initials = name => name.replace(/^(dr|dra)\.?\s+/i, '').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
export const emptyAnalysis = () => ({ grew: '', learned: '', test: '' });

export function addMonthTo(c) {
  const ms = sortedMonths(c);
  const ym = ms.length ? nextYm(ms[ms.length - 1].ym) : nextYm(c.marcoZero.date.slice(0, 7));
  const prev = ms[ms.length - 1];
  c.months.push({
    id: uid(), ym, followers: prev ? prev.followers : c.marcoZero.followers,
    views: null, nonFollowersPct: null, interactions: null, profileVisits: null,
    linkClicks: null, leadsWhatsapp: null, leadsDirect: null, contracts: null,
    analysis: emptyAnalysis(),
  });
  return ym;
}

export const CLASSIFICACOES = {
  'Alcance': 'bg-sky-50 text-sky-700 ring-sky-200',
  'Engajamento': 'bg-amber-50 text-amber-700 ring-amber-200',
  'Crescimento': 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  'Autoridade': 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  'Conversão': 'bg-rose-50 text-rose-700 ring-rose-200',
};
export const FORMATOS = ['Reels', 'Carrossel', 'Foto'];
