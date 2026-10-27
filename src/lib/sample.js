import { clone, emptyAnalysis } from './format';

const carlos = {
  id: 'carlos', sample: true, tone: 0, photo: null,
  name: 'Dr. Carlos Cezar', niche: 'Direito Trabalhista', handle: 'drcarloscezar',
  marcoZero: { date: '2026-07-01', followers: 24500, reach: 38200, views: 61400, nonFollowersPct: 41.2, interactions: 2140, profileVisits: 1870, linkClicks: 96, leads: 7 },
  months: [
    { id: 'c1', ym: '2026-08', followers: 25900, views: 84300, nonFollowersPct: 52.8, interactions: 3010, profileVisits: 2420, linkClicks: 142, leadsWhatsapp: 9, leadsDirect: 4, contracts: 2,
      analysis: { grew: 'Primeiro mês de gestão: +1,4k seguidores e visualizações 37% acima do Marco Zero.', learned: 'Reels curtos com pergunta no gancho funcionaram melhor que vídeos explicativos longos.', test: 'Carrosséis de checklist (verbas rescisórias, FGTS).' } },
    { id: 'c2', ym: '2026-09', followers: 27800, views: 118600, nonFollowersPct: 61.5, interactions: 4280, profileVisits: 3150, linkClicks: 211, leadsWhatsapp: 14, leadsDirect: 6, contracts: 3,
      analysis: { grew: 'Seguidores +7,3% no mês. O Reels sobre assédio moral passou de 39 mil contas alcançadas.', learned: 'Carrosséis de checklist geram mais salvamentos e leads mais qualificados.', test: 'CTA para o WhatsApp no último slide dos carrosséis.' } },
    { id: 'c3', ym: '2026-10', followers: 30000, views: 152900, nonFollowersPct: 64.3, interactions: 5120, profileVisits: 3890, linkClicks: 268, leadsWhatsapp: 19, leadsDirect: 8, contracts: 5,
      analysis: {
        grew: 'Seguidores passaram de 27,8k para 30k (+7,9%), batendo a meta dos 30 mil. Visualizações cresceram 29% no mês, puxadas pelos Reels sobre direitos da gestante e horas extras.',
        learned: 'Reels com pergunta direta nos 2 primeiros segundos alcançam o dobro de não seguidores. O CTA no último slide dobrou os cliques no link da bio em carrosséis.',
        test: 'Série semanal "Direito em 30 segundos" às terças. Caixinha de perguntas nos stories de quinta, com as melhores respostas virando Reels.',
      } },
  ],
  posts: [
    { id: 'p1', date: '2026-10-21', title: 'Fui demitida grávida: quais são meus direitos?', format: 'Reels', classification: 'Alcance', reach: 48200, notes: 'Gancho com pergunta direta. 68% do alcance veio de não seguidores.' },
    { id: 'p2', date: '2026-10-14', title: '5 verbas rescisórias que a empresa esquece de pagar', format: 'Carrossel', classification: 'Autoridade', reach: 21400, notes: '412 salvamentos, a maior taxa de salvamento do mês.' },
    { id: 'p3', date: '2026-10-08', title: 'Horas extras no home office: como provar', format: 'Reels', classification: 'Crescimento', reach: 33700, notes: '+640 seguidores no dia da publicação.' },
    { id: 'p4', date: '2026-10-02', title: 'Bastidores: como funciona a primeira consulta', format: 'Foto', classification: 'Conversão', reach: 6900, notes: '6 contatos no WhatsApp com o link repetido nos stories.' },
    { id: 'p5', date: '2026-09-24', title: 'Justa causa: 4 motivos que a lei aceita', format: 'Carrossel', classification: 'Autoridade', reach: 17800, notes: 'Muitos comentários pedindo parte 2.' },
    { id: 'p6', date: '2026-09-10', title: 'Assédio moral no trabalho: o que fazer', format: 'Reels', classification: 'Alcance', reach: 39100, notes: '1,1 mil compartilhamentos.' },
    { id: 'p7', date: '2026-08-19', title: 'FGTS: como consultar se está sendo depositado', format: 'Reels', classification: 'Engajamento', reach: 22600, notes: '280 comentários com dúvidas, viraram pauta.' },
  ],
};

const mariana = {
  id: 'mariana', sample: true, tone: 1, photo: null,
  name: 'Dra. Mariana Lopes', niche: 'Dermatologia', handle: 'dramarianalopes.derma',
  marcoZero: { date: '2026-08-01', followers: 8200, reach: 12400, views: 19800, nonFollowersPct: 38, interactions: 1320, profileVisits: 610, linkClicks: 41, leads: 5 },
  months: [
    { id: 'm1', ym: '2026-09', followers: 9400, views: 31200, nonFollowersPct: 49.5, interactions: 1890, profileVisits: 880, linkClicks: 63, leadsWhatsapp: 9, leadsDirect: 5, contracts: 6, analysis: emptyAnalysis() },
    { id: 'm2', ym: '2026-10', followers: 11400, views: 46800, nonFollowersPct: 57.1, interactions: 2650, profileVisits: 1240, linkClicks: 92, leadsWhatsapp: 14, leadsDirect: 7, contracts: 9,
      analysis: { grew: 'Seguidores +21% no mês e 9 consultas agendadas vindas do Instagram.', learned: 'Conteúdo de "mitos e verdades" gera muitos comentários, mas o que agenda consulta é o Reels de rotina.', test: '' } },
  ],
  posts: [
    { id: 'q1', date: '2026-10-16', title: 'Protetor solar: quanto passar no rosto', format: 'Reels', classification: 'Alcance', reach: 27400, notes: 'Demonstração com a regra dos dois dedos.' },
    { id: 'q2', date: '2026-10-07', title: 'Melasma tem cura? Mitos e verdades', format: 'Carrossel', classification: 'Autoridade', reach: 12100, notes: '' },
    { id: 'q3', date: '2026-09-22', title: 'Rotina de skincare para pele oleosa', format: 'Reels', classification: 'Crescimento', reach: 18900, notes: '+420 seguidores.' },
  ],
};

const aurora = {
  id: 'aurora', sample: true, tone: 2, photo: null,
  name: 'Casa Aurora Decor', niche: 'Loja de decoração', handle: 'casaaurora.decor',
  marcoZero: { date: '2026-06-01', followers: 15300, reach: 22100, views: 35400, nonFollowersPct: 33, interactions: 2900, profileVisits: 1450, linkClicks: 210, leads: 31 },
  months: [
    { id: 'a1', ym: '2026-07', followers: 15200, views: 33100, nonFollowersPct: 31.4, interactions: 2710, profileVisits: 1390, linkClicks: 198, leadsWhatsapp: 24, leadsDirect: 9, contracts: 14, analysis: emptyAnalysis() },
    { id: 'a2', ym: '2026-08', followers: 15500, views: 38900, nonFollowersPct: 35.2, interactions: 3050, profileVisits: 1520, linkClicks: 231, leadsWhatsapp: 27, leadsDirect: 11, contracts: 17, analysis: emptyAnalysis() },
    { id: 'a3', ym: '2026-09', followers: 15800, views: 41200, nonFollowersPct: 37.9, interactions: 3240, profileVisits: 1610, linkClicks: 254, leadsWhatsapp: 30, leadsDirect: 12, contracts: 19, analysis: emptyAnalysis() },
    { id: 'a4', ym: '2026-10', followers: 16100, views: 44600, nonFollowersPct: 40.1, interactions: 3380, profileVisits: 1700, linkClicks: 279, leadsWhatsapp: 33, leadsDirect: 14, contracts: 22, analysis: emptyAnalysis() },
  ],
  posts: [
    { id: 'r1', date: '2026-10-18', title: 'Mesa posta de primavera em 3 passos', format: 'Reels', classification: 'Engajamento', reach: 14200, notes: '' },
    { id: 'r2', date: '2026-10-09', title: 'Antes e depois: sala de 12 m²', format: 'Carrossel', classification: 'Conversão', reach: 9800, notes: '11 pedidos pelo direct citando o post.' },
  ],
};

export const SAMPLE_CARLOS = carlos;
export const sampleState = () => clone({ gestora: 'Juliana Reis', clients: [carlos, mariana, aurora] });
