-- Projeto F · Etapa 2: preferências pessoais
-- Executar uma vez no SQL Editor, depois do schema.sql inicial.
create table if not exists public.member_preferences (
 user_id uuid primary key references auth.users(id) on delete cascade,
 interests text[] not null default '{}',
 sports text[] not null default '{}',
 goal text not null default '',
 updated_at timestamptz not null default now(),
 constraint preferences_interests_limit check (cardinality(interests)<=12),
 constraint preferences_sports_limit check (cardinality(sports)<=12),
 constraint preferences_goal_limit check (char_length(goal)<=180)
);
alter table public.member_preferences enable row level security;
revoke all on public.member_preferences from anon;
grant select,insert,update on public.member_preferences to authenticated;
drop policy if exists "Preferences own read" on public.member_preferences;
create policy "Preferences own read" on public.member_preferences for select to authenticated using (user_id=(select auth.uid()));
drop policy if exists "Preferences own insert" on public.member_preferences;
create policy "Preferences own insert" on public.member_preferences for insert to authenticated with check (user_id=(select auth.uid()));
drop policy if exists "Preferences own update" on public.member_preferences;
create policy "Preferences own update" on public.member_preferences for update to authenticated using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));
