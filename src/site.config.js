// Textos e valores do site que você deve revisar antes de publicar.
export const site = {
  name: 'Performance Social',
  description: 'O painel de inteligência de social media para gestoras: Marco Zero, acompanhamento mensal, conteúdos, leads e um relatório pronto para mandar ao cliente.',
  // Número com DDI e DDD, só dígitos (ex.: '5511999998888'). Vazio esconde o botão de WhatsApp.
  whatsapp: '',
  contactEmail: '',
  // Preços de exemplo: ajuste antes de divulgar.
  plans: [
    {
      name: 'Solo',
      price: 'R$ 49',
      period: '/mês',
      description: 'Para quem está começando a carteira.',
      features: ['Até 5 clientes', 'As 5 abas do painel', 'Link do relatório para o cliente', 'Dados salvos na nuvem'],
      cta: 'Começar no Solo',
      highlight: false,
    },
    {
      name: 'Agência',
      price: 'R$ 129',
      period: '/mês',
      description: 'Para gestoras com carteira cheia.',
      features: ['Clientes ilimitados', 'Tudo do plano Solo', 'Histórico completo de relatórios', 'Suporte prioritário no WhatsApp'],
      cta: 'Começar no Agência',
      highlight: true,
    },
  ],
};
