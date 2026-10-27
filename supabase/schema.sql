-- Performance Social: esquema do banco (Supabase / Postgres)
-- Rode este arquivo inteiro em Supabase → SQL Editor → New query → Run.

-- Perfil da gestora -------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  name text not null default '',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "gestora lê e edita o próprio perfil" on public.profiles;
create policy "gestora lê e edita o próprio perfil" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- Cria o perfil automaticamente no cadastro
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', ''))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Clientes ----------------------------------------------------------------
-- Cada cliente guarda Marco Zero, meses, posts e análises num único jsonb.
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users on delete cascade,
  data jsonb not null,
  share_token text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists clients_owner_idx on public.clients (owner_id);

alter table public.clients enable row level security;

drop policy if exists "gestora vê só os próprios clientes" on public.clients;
create policy "gestora vê só os próprios clientes" on public.clients
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists clients_touch on public.clients;
create trigger clients_touch before update on public.clients
  for each row execute function public.touch_updated_at();

-- Link público do relatório ------------------------------------------------
-- Quem tem o link vê só aquele cliente, em modo leitura. Nada mais é exposto.
create or replace function public.get_shared_report(p_token text)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'client', c.data || jsonb_build_object('id', c.id),
    'gestora', coalesce(p.name, '')
  )
  from public.clients c
  left join public.profiles p on p.id = c.owner_id
  where length(p_token) >= 20 and c.share_token = p_token
  limit 1
$$;

revoke all on function public.get_shared_report(text) from public;
grant execute on function public.get_shared_report(text) to anon, authenticated;
