-- INVICTAS Pulse — proposed account storage, NOT applied to production.
-- Apply ONLY to a disposable/staging Supabase project after review.
-- Requires Supabase Auth; uses existing auth.users identities.
begin;
create table if not exists public.pulse_documents (
  user_id uuid not null references auth.users(id) on delete cascade,
  area text not null check (area in ('agent','checkins','goals','agenda_alerts','reminders','wellbeing','cycle')),
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object'),
  updated_at timestamptz not null default now(),
  primary key (user_id,area)
);
create table if not exists public.pulse_consents (
  user_id uuid not null references auth.users(id) on delete cascade,
  purpose text not null check (purpose in ('pulse_storage','wellbeing_storage','cycle_storage','cycle_agent_access')),
  granted boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id,purpose)
);
alter table public.pulse_documents enable row level security;
alter table public.pulse_consents enable row level security;
revoke all on public.pulse_documents from public,anon;
revoke all on public.pulse_consents from public,anon;
grant select,insert,update,delete on public.pulse_documents to authenticated;
grant select,insert,update,delete on public.pulse_consents to authenticated;
drop policy if exists pulse_documents_owner_select on public.pulse_documents;
drop policy if exists pulse_documents_owner_insert on public.pulse_documents;
drop policy if exists pulse_documents_owner_update on public.pulse_documents;
drop policy if exists pulse_documents_owner_delete on public.pulse_documents;
create policy pulse_documents_owner_select on public.pulse_documents for select to authenticated using ((select auth.uid())=user_id);
create policy pulse_documents_owner_insert on public.pulse_documents for insert to authenticated with check ((select auth.uid())=user_id);
create policy pulse_documents_owner_update on public.pulse_documents for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy pulse_documents_owner_delete on public.pulse_documents for delete to authenticated using ((select auth.uid())=user_id);
drop policy if exists pulse_consents_owner_select on public.pulse_consents;
drop policy if exists pulse_consents_owner_insert on public.pulse_consents;
drop policy if exists pulse_consents_owner_update on public.pulse_consents;
drop policy if exists pulse_consents_owner_delete on public.pulse_consents;
create policy pulse_consents_owner_select on public.pulse_consents for select to authenticated using ((select auth.uid())=user_id);
create policy pulse_consents_owner_insert on public.pulse_consents for insert to authenticated with check ((select auth.uid())=user_id);
create policy pulse_consents_owner_update on public.pulse_consents for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy pulse_consents_owner_delete on public.pulse_consents for delete to authenticated using ((select auth.uid())=user_id);
-- Additional server-side consent enforcement is mandatory before connecting client writes.
-- RLS ownership alone does NOT enforce purpose-specific consent or restrict an agent
-- that acts with the same user's credentials.
commit;
