# Performance Social

Site com landing page de venda e o painel de performance de social media para gestoras.

| Endereço | O que é |
| --- | --- |
| `/` | Landing page pública |
| `/demo` | Demonstração com 3 clientes de exemplo, sem login (dados ficam no navegador) |
| `/entrar` | Login, cadastro e recuperação de senha |
| `/app` | Painel da gestora logada (dados na nuvem) |
| `/r/<código>` | Relatório do cliente em modo leitura, aberto por link |

Feito com Next.js 14, Tailwind CSS e Supabase (login e banco de dados).

## Rodar no computador

```bash
npm install
npm run dev
```

Abra http://localhost:3000. Sem o Supabase configurado, a landing e a `/demo` funcionam; o `/app` mostra um aviso pedindo a configuração.

## Colocar no ar (cerca de 15 minutos)

### 1. Banco de dados e login (Supabase, plano gratuito)

1. Crie uma conta em https://supabase.com e um projeto novo (região: São Paulo).
2. No projeto, abra **SQL Editor → New query**, cole o conteúdo de `supabase/schema.sql` e clique em **Run**.
3. Em **Project Settings → API**, copie a **Project URL** e a chave **anon public**.
4. Em **Authentication → URL Configuration**, preencha **Site URL** com o endereço final do site (ex.: `https://performancesocial.com.br`) e adicione `https://SEU-DOMINIO/**` em **Redirect URLs**. Isso faz os links de confirmação de e-mail e de nova senha voltarem para o site.

### 2. Hospedagem (Vercel, plano gratuito)

1. Suba esta pasta para um repositório no GitHub.
2. Em https://vercel.com, clique em **Add New → Project** e importe o repositório.
3. Em **Environment Variables**, adicione:
   - `NEXT_PUBLIC_SUPABASE_URL` = Project URL do passo 1.3
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = chave anon do passo 1.3
4. Clique em **Deploy**. Para usar seu domínio, vá em **Settings → Domains**.

Para rodar localmente com o banco, copie `.env.example` para `.env.local` e preencha os mesmos valores.

## Antes de divulgar

- **Preços, WhatsApp e e-mail:** edite `src/site.config.js`. Os preços que estão lá são exemplos.
- **E-mails de confirmação:** o Supabase gratuito envia poucos e-mails por hora. Para lançar, configure um SMTP próprio em **Authentication → Emails → SMTP Settings** (ex.: Resend, Brevo).
- **Cobrança:** o site ainda não cobra assinatura. Os botões dos planos levam ao cadastro. Para cobrar, o próximo passo é integrar Stripe, Mercado Pago, Asaas ou Hotmart e limitar o número de clientes por plano.

## Como os dados são guardados

- Cada cliente é uma linha na tabela `clients`, com Marco Zero, meses, posts e análises num campo `data` (JSON).
- Regras de segurança (RLS) garantem que cada gestora só lê e altera os próprios clientes.
- O link do relatório usa um código aleatório de 28 caracteres. A função `get_shared_report` devolve só aquele cliente, em leitura. Desativar o link no painel apaga o código, e o link antigo para de funcionar.

## Estrutura

```
src/
  app/                 rotas (landing, entrar, app, demo, r)
  components/          painel, abas, cabeçalho, modal, prévia da landing
  lib/                 formatação, dados de exemplo, Supabase, armazenamento
  site.config.js       textos, preços e contato
supabase/schema.sql    tabelas, segurança e função do link público
```
