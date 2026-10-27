'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useWorkspace } from './workspace';
import { Logo } from './ui';

export default function AppHeader({ children }) {
  const { state, setGestora, signOut, mode, base } = useWorkspace();
  const [editingName, setEditingName] = useState(false);
  return (
    <>
      {mode === 'demo' && (
        <div className="bg-slate-900 text-slate-200 text-xs">
          <div className="gutter max-w-6xl mx-auto py-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>Você está na demonstração. Os dados ficam só neste navegador.</span>
            <Link href="/entrar?criar=1" className="font-semibold text-emerald-300 hover:text-emerald-200">Criar minha conta →</Link>
          </div>
        </div>
      )}
      <header className="bg-white border-b border-slate-200">
        <div className="gutter max-w-6xl mx-auto py-3 flex flex-wrap items-center gap-3">
          <Link href={base} aria-label="Meus Clientes"><Logo /></Link>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
              <span>Gestora:</span>
              {editingName
                ? <input id="gestora-nome" autoFocus className="text-input !py-1 !w-44" defaultValue={state.gestora}
                    onBlur={e => { const v = e.target.value.trim(); if (v && v !== state.gestora) setGestora(v); setEditingName(false); }}
                    onKeyDown={e => e.key === 'Enter' && e.currentTarget.blur()} />
                : <button type="button" onClick={() => setEditingName(true)} title="Editar nome" className="font-medium text-slate-800 hover:underline decoration-dotted underline-offset-4">{state.gestora}</button>}
            </div>
            {children}
            <button type="button" onClick={signOut} className="text-sm text-slate-500 hover:text-slate-900">{mode === 'demo' ? 'Sair da demo' : 'Sair'}</button>
          </div>
        </div>
      </header>
    </>
  );
}
