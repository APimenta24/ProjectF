-- Community submissions are separate from the public, editor-approved opportunities table.
create table if not exists public.opportunity_submissions (
 id uuid primary key default gen_random_uuid(),
 author_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
 title text not null check(char_length(title) between 5 and 180),
 summary text not null check(char_length(summary) between 30 and 1500),
 organizer text not null check(char_length(organizer) between 2 and 180),
 url text not null check(url ~* '^https://[^[:space:]]+$'),
 category text not null check(category in ('Formação','Evento','Emprego','Apoio','Captação')),
 sport text,
 location text,
 cost text not null check(cost in ('Gratuito','Pago','Não indicado')),
 deadline_at date,
 created_at timestamptz not null default now(),
 status text not null default 'pending' check(status in ('pending','approved','rejected'))
);
alter table public.opportunity_submissions enable row level security;
grant select,insert,update on public.opportunity_submissions to authenticated;
drop policy if exists "Submissions author read" on public.opportunity_submissions;
create policy "Submissions author read" on public.opportunity_submissions for select to authenticated using(author_id=(select auth.uid()) or public.is_admin());
drop policy if exists "Submissions author insert" on public.opportunity_submissions;
create policy "Submissions author insert" on public.opportunity_submissions for insert to authenticated
with check(author_id=(select auth.uid()) and status='pending');
drop policy if exists "Submissions admin update" on public.opportunity_submissions;
create policy "Submissions admin update" on public.opportunity_submissions for update to authenticated
using(public.is_admin()) with check(public.is_admin());
create index if not exists opportunity_submissions_pending_idx on public.opportunity_submissions(status,created_at desc);
-- Publish only through a server-side admin RPC, never via public form.
create or replace function public.publish_opportunity_submission(p_id uuid)
returns boolean language plpgsql security definer set search_path='' as $$
declare s public.opportunity_submissions; n integer;
begin
 if not public.is_admin() then raise exception 'Not authorized'; end if;
 select * into s from public.opportunity_submissions where id=p_id and status='pending' for update;
 if not found then return false; end if;
 if s.deadline_at is not null and s.deadline_at<current_date then raise exception 'Expired opportunity'; end if;
 insert into public.opportunities(title,summary,organizer,url,interest,sport,deadline_at,status)
 values(s.title,s.summary||case when s.location is not null and s.location<>'' then E'\nLocal: '||s.location else '' end||E'\nParticipação: '||s.cost,s.organizer,s.url,s.category,s.sport,
 case when s.deadline_at is not null then (s.deadline_at::timestamp + interval '23 hours 59 minutes') at time zone 'Europe/Lisbon' else null end,'published');
 update public.opportunity_submissions set status='approved' where id=p_id;
 return true;
end $$;
revoke all on function public.publish_opportunity_submission(uuid) from public;
grant execute on function public.publish_opportunity_submission(uuid) to authenticated;
