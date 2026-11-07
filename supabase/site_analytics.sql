-- INVICTAS: privacy-minimal aggregate event tracking.
-- Apply manually in Supabase SQL Editor. No IP, user ID, cookie or Pulse data stored.
create table if not exists public.site_events (
 id bigint generated always as identity primary key,
 event_type text not null check(event_type in ('page_view','click','story_view')),
 event_label text not null check(char_length(event_label) between 1 and 100),
 created_at timestamptz not null default now()
);
create index if not exists site_events_created_idx on public.site_events(created_at desc);
alter table public.site_events enable row level security;
revoke all on public.site_events from anon,authenticated;
create or replace function public.track_site_event(p_type text,p_label text)
returns void language plpgsql security definer set search_path='' as $$
begin
 if p_type not in ('page_view','click','story_view') or p_label is null or length(p_label) not between 1 and 100 then return; end if;
 insert into public.site_events(event_type,event_label) values(p_type,p_label);
end $$;
revoke all on function public.track_site_event(text,text) from public;
grant execute on function public.track_site_event(text,text) to anon,authenticated;
create or replace function public.site_analytics_summary()
returns table(event_type text,event_label text,event_count bigint)
language sql stable security definer set search_path='' as $$
 select e.event_type,e.event_label,count(*)::bigint
 from public.site_events e
 where public.is_admin() and e.created_at >= now()-interval '30 days'
 group by e.event_type,e.event_label
 order by count(*) desc
 limit 100
$$;
revoke all on function public.site_analytics_summary() from public;
grant execute on function public.site_analytics_summary() to authenticated;
-- Operational: purge event rows older than 90 days via a scheduled database job.
-- Tracking is aggregate event counts, NOT unique visitors, sessions or conversion attribution.
