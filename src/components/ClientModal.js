'use client';
import { useEffect, useState } from 'react';
import { parseNum, todayISO } from '@/lib/format';
import { btnGhost, btnPrimary } from './ui';

export const MZ_FIELDS = [
  ['followers', 'Seguidores iniciais'], ['reach', 'Alcance pré-gestão'], ['views', 'Visualizações'],
  ['nonFollowersPct', 'Não seguidores (%)'], ['interactions', 'Interações'], ['profileVisits', 'Visitas ao perfil'],
  ['linkClicks', 'Cliques no link'], ['leads', 'Leads'],
];

function resizeImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const S = 160, cv = document.createElement('canvas'); cv.width = S; cv.height = S;
        const ctx = cv.getContext('2d'); const m = Math.min(img.width, img.height);
        ctx.drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, S, S);
        resolve(cv.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = reject; img.src = reader.result;
    };
    reader.onerror = reject; reader.readAsDataURL(file);
  });
}

export default function ClientModal({ onClose, onSave, count }) {
  const [f, setF] = useState({ name: '', niche: '', handle: '', date: todayISO(), photo: null, mz: {} });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setF(s => ({ ...s, [k]: v }));
  useEffect(() => { const k = e => e.key === 'Escape' && onClose(); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, [onClose]);

  const submit = async e => {
    e.preventDefault();
    if (!f.name.trim()) return setError('Informe o nome do cliente.');
    if (parseNum(f.mz.followers) == null) return setError('Informe os seguidores iniciais. Eles são a base do cálculo de crescimento.');
    const marcoZero = { date: f.date || todayISO() };
    MZ_FIELDS.forEach(([k]) => { marcoZero[k] = parseNum(f.mz[k]); });
    setBusy(true);
    try {
      await onSave({ tone: count, photo: f.photo, name: f.name.trim(), niche: f.niche.trim() || 'Sem nicho definido', handle: f.handle.trim().replace(/^@/, '') || 'perfil', marcoZero, months: [], posts: [] });
    } catch (err) {
      setError(`Não foi possível cadastrar: ${err.message || err}`);
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[2px] overflow-y-auto" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className="gutter min-h-full flex items-start sm:items-center justify-center py-6">
        <form onSubmit={submit} className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-200 fade-in" role="dialog" aria-modal="true" aria-labelledby="novo-cliente-titulo">
          <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between gap-3">
            <h2 id="novo-cliente-titulo" className="text-lg font-semibold text-slate-900">Novo cliente</h2>
            <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xl leading-none px-2" aria-label="Fechar">×</button>
          </div>
          <div className="px-6 py-5 grid gap-5">
            <div className="flex items-center gap-4">
              <label htmlFor="nc-foto" className="cursor-pointer shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {f.photo ? <img src={f.photo} alt="" className="w-16 h-16 rounded-full object-cover ring-1 ring-slate-200" />
                  : <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 grid place-items-center text-[11px] text-slate-400 text-center leading-tight">Foto<br />opcional</div>}
              </label>
              <input id="nc-foto" type="file" accept="image/*" className="sr-only" onChange={async e => { const file = e.target.files[0]; if (file) { try { set('photo', await resizeImage(file)); } catch (_) { setError('Não foi possível ler essa imagem. Tente um JPG ou PNG.'); } } }} />
              <div className="flex-1 min-w-0">
                <label htmlFor="nc-nome" className="text-xs font-medium text-slate-600">Nome do cliente</label>
                <input id="nc-nome" className="text-input mt-1" placeholder="Ex.: Dr. Carlos Cezar" value={f.name} onChange={e => set('name', e.target.value)} autoFocus />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="nc-nicho" className="text-xs font-medium text-slate-600">Nicho</label>
                <input id="nc-nicho" className="text-input mt-1" placeholder="Ex.: Direito Trabalhista" value={f.niche} onChange={e => set('niche', e.target.value)} />
              </div>
              <div>
                <label htmlFor="nc-handle" className="text-xs font-medium text-slate-600">@ do perfil</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">@</span>
                  <input id="nc-handle" className="text-input !pl-7" placeholder="drcarloscezar" value={f.handle} onChange={e => set('handle', e.target.value)} />
                </div>
              </div>
            </div>
            <fieldset className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <legend className="px-1 text-xs font-semibold text-slate-700 eyebrow">Marco Zero</legend>
              <p className="text-xs text-slate-500 mb-3">Os números do perfil antes da gestão. Você pode completar ou ajustar depois.</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="nc-data" className="text-xs font-medium text-slate-600">Data de início</label>
                  <input id="nc-data" type="date" className="text-input mt-1" value={f.date} onChange={e => set('date', e.target.value)} />
                </div>
                {MZ_FIELDS.map(([k, label]) => (
                  <div key={k}>
                    <label htmlFor={`nc-${k}`} className="text-xs font-medium text-slate-600">{label}</label>
                    <input id={`nc-${k}`} className="text-input mt-1 tnum" inputMode="decimal" placeholder={k === 'followers' ? 'Ex.: 24.500 ou 24,5k' : '—'} value={f.mz[k] || ''} onChange={e => setF(s => ({ ...s, mz: { ...s.mz, [k]: e.target.value } }))} />
                  </div>
                ))}
              </div>
            </fieldset>
            {error && <p className="text-sm text-rose-600" role="alert">{error}</p>}
          </div>
          <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
            <button type="button" className={btnGhost} onClick={onClose}>Cancelar</button>
            <button type="submit" className={btnPrimary} disabled={busy}>{busy ? 'Cadastrando…' : 'Cadastrar cliente'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
