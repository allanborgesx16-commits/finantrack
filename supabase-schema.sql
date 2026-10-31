-- ========================================================
-- BANCO DE DADOS SUPABASE: FINANTRACK
-- Execute este script no SQL Editor do seu painel Supabase
-- ========================================================

-- 1. Tabela de Perfis de Usuário
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  name text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Ativar RLS para profiles
alter table public.profiles enable row level security;

create policy "Usuários podem ver seu próprio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Usuários podem atualizar seu próprio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- 2. Tabela de Transações (Recebimentos e Gastos)
create table if not exists public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  type text check (type in ('income', 'expense')) not null,
  amount numeric(12,2) not null check (amount > 0),
  description text not null,
  category text not null,
  date date not null default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Índices para buscas rápidas
create index if not exists idx_transactions_user_id on public.transactions (user_id);
create index if not exists idx_transactions_date on public.transactions (date);

-- Ativar RLS para transactions
alter table public.transactions enable row level security;

create policy "Usuário visualiza apenas suas transações"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Usuário insere suas próprias transações"
  on public.transactions for insert
  with check (auth.uid() = user_id);

create policy "Usuário atualiza suas próprias transações"
  on public.transactions for update
  using (auth.uid() = user_id);

create policy "Usuário exclui suas próprias transações"
  on public.transactions for delete
  using (auth.uid() = user_id);
