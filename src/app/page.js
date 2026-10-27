import Link from 'next/link';
import { site } from '@/site.config';
import ProductPreview from '@/components/ProductPreview';
import { Logo } from '@/components/ui';
import { btnAccent, btnGhost, btnPrimary } from '@/components/styles';

const RECURSOS = [
  { tag: 'Marco Zero', title: 'O ponto de partida registrado', text: 'Seguidores, alcance, visualizações, interações, visitas, cliques e leads antes da gestão. Todo crescimento é medido a partir daqui.' },
  { tag: 'Mensal', title: 'Comparativo mês a mês', text: 'Uma tabela por cliente com cada mês lado a lado e o crescimento total calculado sozinho. Sem fórmula quebrada.' },
  { tag: 'Conteúdos', title: 'Inteligência de posts', text: 'Registre os melhores posts e classifique por Alcance, Engajamento, Crescimento, Autoridade ou Conversão.' },
  { tag: 'Leads', title: 'Do clique ao contrato', text: 'Cliques no link da bio, leads no WhatsApp e no direct e contratos fechados, com a taxa de conversão de cada etapa.' },
  { tag: 'Executivo', title: 'Dashboard do mês', text: 'Os números principais com a variação sobre o mês anterior, os 3 posts de maior alcance e a sua análise do mês.' },
  { tag: 'Cliente', title: 'Relatório por link', text: 'Ative o modo cliente ou gere um link de leitura e mande direto no WhatsApp. O cliente abre no celular, sem login.' },
];

const PASSOS = [
  ['Cadastre o cliente com o Marco Zero', 'Nome, nicho, @ do perfil e os números do Instagram no dia em que você assumiu a conta.'],
  ['Feche o mês em poucos minutos', 'Lance os números do Instagram, os melhores posts e os leads. O painel calcula crescimento e conversão.'],
  ['Mande o relatório', 'Escreva o que cresceu, o que aprendeu e o que vai testar, e envie o link para o cliente no WhatsApp.'],
];

const PLANILHA = ['Uma aba por cliente, cada uma com fórmulas diferentes', 'Print de tabela cortado no WhatsApp', 'O cliente não entende o que mudou', 'Leads e contratos anotados em outro lugar'];
const PAINEL = ['O mesmo painel para todos os clientes', 'Relatório limpo, pronto para enviar', 'Crescimento desde o Marco Zero em destaque', 'Do clique no link ao contrato, num lugar só'];

const FAQ = [
  ['Preciso conectar o Instagram do cliente?', 'Não. Você lança os números que já acompanha no Instagram. Assim funciona com qualquer conta, sem pedir senha ou acesso ao cliente.'],
  ['O cliente precisa criar conta para ver o relatório?', 'Não. Você gera um link de leitura e ele abre direto no celular. Se quiser, desativa o link a qualquer momento.'],
  ['Funciona para qualquer nicho?', 'Sim. Médicos, advogados, lojas, prestadores de serviço. Para clínicas, "contratos" vira consultas agendadas; para lojas, vendas pelo direct.'],
  ['Meus dados ficam seguros?', 'Cada gestora só enxerga os próprios clientes. Os dados ficam num banco de dados com acesso protegido por conta.'],
  ['Posso testar antes?', 'Pode. A demonstração abre com três clientes de exemplo e funciona inteira, sem cadastro.'],
];

function Check({ className = 'text-emerald-600' }) {
  return <svg viewBox="0 0 20 20" width="16" height="16" className={`shrink-0 mt-0.5 ${className}`} aria-hidden="true"><path d="M5 10.5 8.5 14 15 6.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function Cross() {
  return <svg viewBox="0 0 20 20" width="16" height="16" className="shrink-0 mt-0.5 text-slate-400" aria-hidden="true"><path d="M6 6l8 8M14 6l-8 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
}

export default function Landing() {
  const wa = site.whatsapp ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent('Olá! Quero saber mais sobre o Performance Social.')}` : null;
  return (
    <div className="bg-white">
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-slate-100">
        <div className="gutter max-w-6xl mx-auto py-3 flex items-center gap-6">
          <Link href="/" aria-label="Página inicial"><Logo /></Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600" aria-label="Seções">
            <a href="#recursos" className="hover:text-slate-900">Recursos</a>
            <a href="#como-funciona" className="hover:text-slate-900">Como funciona</a>
            <a href="#planos" className="hover:text-slate-900">Planos</a>
            <a href="#duvidas" className="hover:text-slate-900">Dúvidas</a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/entrar" className="hidden sm:inline text-sm font-medium text-slate-600 hover:text-slate-900 px-2">Entrar</Link>
            <Link href="/entrar?criar=1" className={btnPrimary}>Criar conta</Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="bg-slate-50 border-b border-slate-100">
          <div className="gutter max-w-6xl mx-auto py-14 lg:py-20 grid gap-12 lg:grid-cols-[1.05fr_1fr] items-center">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-emerald-700 eyebrow">Para gestoras de social media</p>
              <h1 className="text-4xl sm:text-5xl font-semibold text-slate-900 tracking-tight leading-[1.08] mt-4">
                A ficha de cada cliente do Instagram, num painel só.
              </h1>
              <p className="text-lg text-slate-600 mt-5 max-w-xl leading-relaxed">
                Registre o Marco Zero, acompanhe o crescimento mês a mês e mande para o cliente um relatório que ele entende. Sem planilha.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/entrar?criar=1" className={btnAccent + ' !px-5 !py-3 !text-base'}>Criar minha conta</Link>
                <Link href="/demo" className={btnGhost + ' !px-5 !py-3 !text-base'}>Ver demonstração</Link>
              </div>
              <p className="text-sm text-slate-500 mt-4">A demonstração abre com 3 clientes de exemplo. Não precisa de cadastro.</p>
            </div>
            <div className="min-w-0"><ProductPreview /></div>
          </div>
        </section>

        {/* Planilha x Painel */}
        <section className="gutter max-w-6xl mx-auto py-16 lg:py-20">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">O fim do mês sem caça aos números</h2>
            <p className="text-slate-600 mt-3 leading-relaxed">Toda gestora conhece o ritual: abrir o Instagram de cada cliente, copiar números para a planilha, ajeitar a fórmula, tirar print e explicar no áudio. O painel organiza esse ritual.</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-500 eyebrow">Com planilha</h3>
              <ul className="mt-4 grid gap-3">{PLANILHA.map(t => <li key={t} className="flex gap-2.5 text-slate-600"><Cross />{t}</li>)}</ul>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
              <h3 className="text-sm font-semibold text-emerald-700 eyebrow">Com o Performance Social</h3>
              <ul className="mt-4 grid gap-3">{PAINEL.map(t => <li key={t} className="flex gap-2.5 text-slate-800"><Check />{t}</li>)}</ul>
            </div>
          </div>
        </section>

        {/* Recursos */}
        <section id="recursos" className="bg-slate-50 border-y border-slate-100 scroll-mt-16">
          <div className="gutter max-w-6xl mx-auto py-16 lg:py-20">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Cinco abas e um modo cliente</h2>
              <p className="text-slate-600 mt-3 leading-relaxed">Cada cliente tem o mesmo painel, do ponto de partida ao contrato fechado.</p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {RECURSOS.map(r => (
                <article key={r.tag} className="rounded-xl bg-white border border-slate-200 p-6">
                  <span className="inline-block rounded-md bg-slate-900 text-white text-[11px] font-semibold px-2 py-0.5">{r.tag}</span>
                  <h3 className="text-lg font-semibold text-slate-900 mt-4">{r.title}</h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">{r.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Como funciona */}
        <section id="como-funciona" className="gutter max-w-6xl mx-auto py-16 lg:py-20 scroll-mt-16">
          <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Como funciona</h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {PASSOS.map(([title, text], i) => (
              <li key={title} className="border-t-2 border-slate-900 pt-5">
                <span className="text-sm font-semibold text-emerald-700 tnum">Passo {i + 1}</span>
                <h3 className="text-lg font-semibold text-slate-900 mt-2">{title}</h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">{text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Relatório */}
        <section className="bg-slate-900 text-white">
          <div className="gutter max-w-6xl mx-auto py-16 lg:py-20 grid gap-10 lg:grid-cols-2 items-center">
            <div>
              <p className="text-xs font-semibold text-emerald-300 eyebrow">Relatório do cliente</p>
              <h2 className="text-3xl font-semibold tracking-tight mt-3">O cliente vê o resultado, não a planilha</h2>
              <p className="text-slate-300 mt-4 leading-relaxed max-w-lg">No modo cliente, todos os botões de edição somem. Fica uma apresentação limpa com o crescimento desde o Marco Zero, os destaques de conteúdo e a sua análise do mês. Mande por link ou tire um print.</p>
            </div>
            <div className="rounded-xl bg-slate-800 border border-slate-700 p-6 grid gap-4">
              {[['1. O que cresceu?', 'Seguidores passaram de 27,8k para 30k (+7,9%), batendo a meta dos 30 mil.'], ['2. O que aprendemos?', 'Reels com pergunta direta nos 2 primeiros segundos alcançam o dobro de não seguidores.'], ['3. O que vamos testar?', 'Série semanal "Direito em 30 segundos" às terças.']].map(([q, a]) => (
                <div key={q}>
                  <div className="text-sm font-semibold text-white">{q}</div>
                  <p className="text-sm text-slate-300 mt-1">{a}</p>
                </div>
              ))}
              <p className="text-[11px] text-slate-500">Trecho do cliente de exemplo da demonstração.</p>
            </div>
          </div>
        </section>

        {/* Planos */}
        <section id="planos" className="gutter max-w-6xl mx-auto py-16 lg:py-20 scroll-mt-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Planos</h2>
            <p className="text-slate-600 mt-3">Comece pelo tamanho da sua carteira e mude quando ela crescer.</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 max-w-4xl">
            {site.plans.map(p => (
              <article key={p.name} className={`rounded-2xl p-7 flex flex-col ${p.highlight ? 'bg-slate-900 text-white' : 'border border-slate-200'}`}>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold">{p.name}</h3>
                  {p.highlight && <span className="rounded-full bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30 px-2.5 py-0.5 text-xs font-semibold">Mais escolhido</span>}
                </div>
                <p className={`text-sm mt-1 ${p.highlight ? 'text-slate-300' : 'text-slate-500'}`}>{p.description}</p>
                <div className="mt-5 flex items-baseline gap-1"><span className="text-4xl font-semibold tnum tracking-tight">{p.price}</span><span className={p.highlight ? 'text-slate-400' : 'text-slate-500'}>{p.period}</span></div>
                <ul className="mt-6 grid gap-2.5 text-sm flex-1">{p.features.map(f => <li key={f} className="flex gap-2.5"><Check className={p.highlight ? 'text-emerald-300' : 'text-emerald-600'} />{f}</li>)}</ul>
                <Link href="/entrar?criar=1" className={`mt-7 ${p.highlight ? btnAccent : btnPrimary} !py-2.5`}>{p.cta}</Link>
              </article>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="duvidas" className="bg-slate-50 border-t border-slate-100 scroll-mt-16">
          <div className="gutter max-w-3xl mx-auto py-16 lg:py-20">
            <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Dúvidas frequentes</h2>
            <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
              {FAQ.map(([q, a]) => (
                <details key={q} className="group py-4">
                  <summary className="flex items-center justify-between gap-4 font-medium text-slate-900">
                    {q}
                    <span className="faq-icon text-xl text-slate-400 transition-transform" aria-hidden="true">+</span>
                  </summary>
                  <p className="text-slate-600 mt-3 leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="gutter max-w-6xl mx-auto py-16 lg:py-20 text-center">
          <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Feche o próximo mês no painel</h2>
          <p className="text-slate-600 mt-3">Crie sua conta e cadastre o primeiro cliente em poucos minutos.</p>
          <div className="mt-7 flex flex-wrap gap-3 justify-center">
            <Link href="/entrar?criar=1" className={btnAccent + ' !px-5 !py-3 !text-base'}>Criar minha conta</Link>
            {wa
              ? <a href={wa} target="_blank" rel="noreferrer" className={btnGhost + ' !px-5 !py-3 !text-base'}>Falar no WhatsApp</a>
              : <Link href="/demo" className={btnGhost + ' !px-5 !py-3 !text-base'}>Ver demonstração</Link>}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-100">
        <div className="gutter max-w-6xl mx-auto py-8 flex flex-wrap items-center justify-between gap-4 text-sm text-slate-500">
          <Logo />
          <div className="flex flex-wrap gap-5">
            <Link href="/demo" className="hover:text-slate-900">Demonstração</Link>
            <Link href="/entrar" className="hover:text-slate-900">Entrar</Link>
            {site.contactEmail && <span className="select-all">{site.contactEmail}</span>}
          </div>
          <span>© {new Date().getFullYear()} {site.name}</span>
        </div>
      </footer>
    </div>
  );
}
