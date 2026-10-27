'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cloudEnabled, supabase } from '@/lib/supabase';
import { Logo, btnGhost, btnPrimary } from '@/components/ui';

const ERROS = {
  'Invalid login credentials': 'E-mail ou senha incorretos.',
  'Email not confirmed': 'Confirme seu e-mail pelo link que enviamos antes de entrar.',
  'User already registered': 'Já existe uma conta com este e-mail. Use "Entrar".',
};
const traduz = msg => ERROS[msg] || msg;

export default function EntrarPage() {
  const router = useRouter();
  const [view, setView] = useState('entrar'); // entrar | criar | esqueci | nova-senha
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [msg, setMsg] = useState(null); // { tipo: 'erro' | 'ok', texto }
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('criar')) setView('criar');
    if (!cloudEnabled) return;
    supabase.auth.getSession().then(({ data }) => { if (data.session && !window.location.hash.includes('type=recovery')) router.replace('/app'); });
    const { data } = supabase.auth.onAuthStateChange(event => { if (event === 'PASSWORD_RECOVERY') setView('nova-senha'); });
    return () => data.subscription.unsubscribe();
  }, [router]);

  if (!cloudEnabled) return (
    <Shell>
      <h1 className="text-xl font-semibold text-slate-900">Contas ainda não ativadas</h1>
      <p className="text-sm text-slate-500 mt-2">O banco de dados deste site ainda não foi conectado. Enquanto isso, você pode explorar a demonstração completa.</p>
      <div className="mt-5 flex flex-wrap gap-2"><Link href="/demo" className={btnPrimary}>Abrir a demonstração</Link><Link href="/" className={btnGhost}>Voltar ao site</Link></div>
    </Shell>
  );

  const submit = async e => {
    e.preventDefault();
    setBusy(true); setMsg(null);
    try {
      if (view === 'entrar') {
        const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
        if (error) throw error;
        router.replace('/app');
      } else if (view === 'criar') {
        if (form.password.length < 8) throw new Error('Use uma senha com pelo menos 8 caracteres.');
        const { data, error } = await supabase.auth.signUp({
          email: form.email, password: form.password,
          options: { data: { name: form.name.trim() }, emailRedirectTo: `${window.location.origin}/app` },
        });
        if (error) throw error;
        if (data.session) router.replace('/app');
        else setMsg({ tipo: 'ok', texto: `Conta criada. Enviamos um link de confirmação para ${form.email}. Abra o e-mail para entrar.` });
      } else if (view === 'esqueci') {
        const { error } = await supabase.auth.resetPasswordForEmail(form.email, { redirectTo: `${window.location.origin}/entrar` });
        if (error) throw error;
        setMsg({ tipo: 'ok', texto: `Se existir uma conta com ${form.email}, enviamos um link para criar uma nova senha.` });
      } else if (view === 'nova-senha') {
        if (form.password.length < 8) throw new Error('Use uma senha com pelo menos 8 caracteres.');
        const { error } = await supabase.auth.updateUser({ password: form.password });
        if (error) throw error;
        router.replace('/app');
      }
    } catch (err) {
      setMsg({ tipo: 'erro', texto: traduz(err.message || String(err)) });
    }
    setBusy(false);
  };

  const titles = { entrar: 'Entrar no painel', criar: 'Criar sua conta', esqueci: 'Recuperar senha', 'nova-senha': 'Criar nova senha' };
  const actions = { entrar: 'Entrar', criar: 'Criar conta', esqueci: 'Enviar link', 'nova-senha': 'Salvar nova senha' };

  return (
    <Shell>
      <h1 className="text-xl font-semibold text-slate-900">{titles[view]}</h1>
      {view === 'criar' && <p className="text-sm text-slate-500 mt-1">Seus clientes ficam salvos na nuvem e você acessa de qualquer aparelho.</p>}
      <form onSubmit={submit} className="mt-6 grid gap-4">
        {view === 'criar' && (
          <div><label htmlFor="f-nome" className="text-xs font-medium text-slate-600">Seu nome</label>
            <input id="f-nome" required className="text-input mt-1" autoComplete="name" placeholder="Como aparece nos relatórios" value={form.name} onChange={e => set('name', e.target.value)} /></div>
        )}
        {view !== 'nova-senha' && (
          <div><label htmlFor="f-email" className="text-xs font-medium text-slate-600">E-mail</label>
            <input id="f-email" type="email" required className="text-input mt-1" autoComplete="email" value={form.email} onChange={e => set('email', e.target.value)} /></div>
        )}
        {view !== 'esqueci' && (
          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="f-senha" className="text-xs font-medium text-slate-600">{view === 'nova-senha' ? 'Nova senha' : 'Senha'}</label>
              {view === 'entrar' && <button type="button" className="text-xs text-slate-500 hover:text-slate-900" onClick={() => { setView('esqueci'); setMsg(null); }}>Esqueci a senha</button>}
            </div>
            <input id="f-senha" type="password" required minLength={view === 'entrar' ? undefined : 8} className="text-input mt-1"
              autoComplete={view === 'entrar' ? 'current-password' : 'new-password'} value={form.password} onChange={e => set('password', e.target.value)} />
            {view !== 'entrar' && <p className="text-xs text-slate-400 mt-1">Mínimo de 8 caracteres.</p>}
          </div>
        )}
        {msg && <p role="alert" className={`text-sm rounded-lg px-3 py-2 ${msg.tipo === 'erro' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-800'}`}>{msg.texto}</p>}
        <button type="submit" disabled={busy} className={btnPrimary + ' w-full !py-2.5'}>{busy ? 'Aguarde…' : actions[view]}</button>
      </form>
      <div className="mt-6 pt-5 border-t border-slate-100 text-sm text-slate-500">
        {view === 'entrar' && <>Ainda não tem conta? <button type="button" className="font-medium text-emerald-700 hover:underline" onClick={() => { setView('criar'); setMsg(null); }}>Criar conta</button></>}
        {view !== 'entrar' && view !== 'nova-senha' && <>Já tem conta? <button type="button" className="font-medium text-emerald-700 hover:underline" onClick={() => { setView('entrar'); setMsg(null); }}>Entrar</button></>}
      </div>
    </Shell>
  );
}

function Shell({ children }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="gutter py-8 flex flex-col">
        <Link href="/" aria-label="Página inicial"><Logo /></Link>
        <div className="flex-1 grid place-items-center py-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>
        <p className="text-xs text-slate-400">Quer só conhecer? <Link href="/demo" className="text-slate-600 hover:underline">Abra a demonstração</Link> sem criar conta.</p>
      </div>
      <aside className="hidden lg:flex bg-slate-900 text-white p-12 flex-col justify-end">
        <p className="text-xs font-semibold text-emerald-300 eyebrow">Caso de exemplo</p>
        <p className="text-4xl font-semibold tnum tracking-tight mt-3">24,5k → 30k</p>
        <p className="text-slate-300 mt-2 max-w-sm">seguidores em três meses de gestão, com 5 contratos fechados pelo Instagram no último mês. É assim que o cliente vê o seu trabalho no relatório.</p>
      </aside>
    </div>
  );
}
