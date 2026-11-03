-- Projeto F · oportunidades reais, com curadoria editorial
create table if not exists public.opportunities (
 id uuid primary key default gen_random_uuid(),
 title text not null check (char_length(title) between 5 and 180),
 summary text not null check (char_length(summary) between 10 and 1500),
 organizer text not null check (char_length(organizer) between 2 and 180),
 url text not null check (url ~* '^https://[^[:space:]]+$'),
 interest text not null,
 sport text,
 starts_at timestamptz,
 deadline_at timestamptz,
 status text not null default 'draft' check (status in ('draft','published','archived')),
 created_at timestamptz not null default now()
);
alter table public.opportunities enable row level security;
grant select on public.opportunities to anon,authenticated;
grant insert,update on public.opportunities to authenticated;
drop policy if exists "Opportunities read" on public.opportunities;
create policy "Opportunities read" on public.opportunities for select to anon,authenticated using (status='published' or public.is_admin());
drop policy if exists "Opportunities admin insert" on public.opportunities;
create policy "Opportunities admin insert" on public.opportunities for insert to authenticated with check (public.is_admin());
drop policy if exists "Opportunities admin update" on public.opportunities;
create policy "Opportunities admin update" on public.opportunities for update to authenticated using (public.is_admin()) with check (public.is_admin());
create index if not exists opportunities_status_created_idx on public.opportunities(status,created_at desc);
