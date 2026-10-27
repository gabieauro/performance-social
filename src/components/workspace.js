'use client';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cloudEnabled, supabase } from '@/lib/supabase';
import { cloudStore, demoStore } from '@/lib/store';
import { clone, randomToken } from '@/lib/format';
import { SAMPLE_CARLOS } from '@/lib/sample';
import { CenterMessage, btnPrimary, btnGhost } from './ui';

const WorkspaceContext = createContext(null);
export const useWorkspace = () => useContext(WorkspaceContext);

const SAVE_DELAY = 700;

export function WorkspaceProvider({ mode, children }) {
  const router = useRouter();
  const base = mode === 'demo' ? '/demo' : '/app';
  const [status, setStatus] = useState('loading'); // loading | ready | error | unconfigured
  const [errorMsg, setErrorMsg] = useState('');
  const [state, setState] = useState(null);
  const [user, setUser] = useState(null);
  const [saveState, setSaveState] = useState('idle'); // idle | saving | saved | error
  const storeRef = useRef(null);
  const stateRef = useRef(null);
  const pending = useRef({});
  const timers = useRef({});

  const apply = next => { stateRef.current = next; setState(next); };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (mode === 'demo') {
        storeRef.current = demoStore();
        const s = await storeRef.current.load();
        if (!cancelled) { apply(s); setStatus('ready'); }
        return;
      }
      if (!cloudEnabled) { setStatus('unconfigured'); return; }
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace('/entrar'); return; }
      storeRef.current = cloudStore(session.user);
      setUser(session.user);
      try {
        const s = await storeRef.current.load();
        if (!cancelled) { apply(s); setStatus('ready'); }
      } catch (e) {
        if (!cancelled) { setErrorMsg(e.message || String(e)); setStatus('error'); }
      }
    })();
    return () => { cancelled = true; };
  }, [mode, router]);

  useEffect(() => {
    if (mode !== 'cloud' || !cloudEnabled) return;
    const { data } = supabase.auth.onAuthStateChange((event) => { if (event === 'SIGNED_OUT') router.replace('/entrar'); });
    return () => data.subscription.unsubscribe();
  }, [mode, router]);

  const flush = useCallback(async id => {
    const client = pending.current[id];
    if (!client) return;
    delete pending.current[id];
    try {
      await storeRef.current.save(client);
      setSaveState(Object.keys(pending.current).length ? 'saving' : 'saved');
    } catch (e) {
      pending.current[id] = pending.current[id] || client;
      setSaveState('error');
    }
  }, []);

  // Avisa antes de fechar a aba com alteração ainda não salva
  useEffect(() => {
    const onBeforeUnload = e => { if (Object.keys(pending.current).length) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, []);

  const updateClient = useCallback((id, fn) => {
    const s = stateRef.current;
    const current = s.clients.find(c => c.id === id);
    if (!current) return;
    const copy = clone(current);
    fn(copy);
    apply({ ...s, clients: s.clients.map(c => c.id === id ? copy : c) });
    pending.current[id] = copy;
    setSaveState('saving');
    clearTimeout(timers.current[id]);
    timers.current[id] = setTimeout(() => flush(id), SAVE_DELAY);
  }, [flush]);

  const retrySave = () => Object.keys(pending.current).forEach(id => flush(id));

  const addClient = async client => {
    const created = await storeRef.current.create(client);
    apply({ ...stateRef.current, clients: [...stateRef.current.clients, created] });
    return created;
  };

  const loadSample = async () => {
    const { id, ...sample } = clone(SAMPLE_CARLOS);
    return addClient(sample);
  };

  const deleteClient = async id => {
    clearTimeout(timers.current[id]);
    delete pending.current[id];
    await storeRef.current.remove(id);
    apply({ ...stateRef.current, clients: stateRef.current.clients.filter(c => c.id !== id) });
  };

  const removeSamples = async () => {
    for (const c of stateRef.current.clients.filter(c => c.sample)) await deleteClient(c.id);
  };

  const setGestora = async name => {
    apply({ ...stateRef.current, gestora: name });
    try { await storeRef.current.setGestora(name); } catch (e) { setSaveState('error'); }
  };

  const setShare = async (id, enabled) => {
    const token = enabled ? (mode === 'demo' ? 'demo-' : '') + randomToken() : null;
    await storeRef.current.setShare(id, token);
    apply({ ...stateRef.current, clients: stateRef.current.clients.map(c => c.id === id ? { ...c, shareToken: token } : c) });
    return token;
  };

  const signOut = async () => {
    if (mode === 'cloud') await supabase.auth.signOut();
    router.replace('/');
  };

  if (status === 'unconfigured') return (
    <CenterMessage title="O banco de dados ainda não foi conectado">
      <p>Para criar contas e salvar clientes na nuvem, configure o Supabase seguindo o README do projeto (variáveis <code className="text-slate-700">NEXT_PUBLIC_SUPABASE_URL</code> e <code className="text-slate-700">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>).</p>
      <div className="flex flex-wrap gap-2 justify-center"><Link href="/demo" className={btnPrimary}>Abrir a demonstração</Link><Link href="/" className={btnGhost}>Voltar ao site</Link></div>
    </CenterMessage>
  );
  if (status === 'error') return (
    <CenterMessage title="Não foi possível carregar seus clientes">
      <p>{errorMsg}</p>
      <p>Confira se o arquivo <code className="text-slate-700">supabase/schema.sql</code> foi executado no seu projeto Supabase e tente de novo.</p>
      <button type="button" className={btnPrimary} onClick={() => window.location.reload()}>Tentar de novo</button>
    </CenterMessage>
  );
  if (status !== 'ready') return <CenterMessage title="Carregando seus clientes…" />;

  const value = {
    mode, base, user, state, saveState,
    updateClient, retrySave, addClient, loadSample, deleteClient, removeSamples, setGestora, setShare, signOut,
  };
  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function SaveIndicator() {
  const { saveState, retrySave, mode } = useWorkspace();
  if (saveState === 'idle') return null;
  if (saveState === 'error') return <button type="button" onClick={retrySave} className="text-xs font-medium text-rose-600 hover:underline">Não salvou. Tentar de novo</button>;
  const where = mode === 'demo' ? 'neste navegador' : 'na nuvem';
  return <span className="text-xs text-slate-400" aria-live="polite">{saveState === 'saving' ? 'Salvando…' : `Salvo ${where}`}</span>;
}
