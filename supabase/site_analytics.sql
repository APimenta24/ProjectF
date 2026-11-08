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

-- Optional consent-based visitor measurement. Run this section after the base migration.
alter table public.site_events add column if not exists visitor_token uuid;
alter table public.site_events add column if not exists traffic_source text;
create index if not exists site_events_visitor_idx on public.site_events(visitor_token,created_at desc) where visitor_token is not null;
drop function if exists public.track_site_event(text,text);
create or replace function public.track_site_event(p_type text,p_label text,p_visitor uuid default null,p_source text default null)
returns void language plpgsql security definer set search_path='' as $$
begin
 if p_type not in ('page_view','click','story_view') or p_label is null or length(p_label) not between 1 and 100 then return; end if;
 insert into public.site_events(event_type,event_label,visitor_token,traffic_source)
 values(p_type,p_label,p_visitor,case when p_source in ('instagram','search','referral','direct','other') then p_source else null end);
end $$;
revoke all on function public.track_site_event(text,text,uuid,text) from public;
grant execute on function public.track_site_event(text,text,uuid,text) to anon,authenticated;
create or replace function public.site_visitor_summary()
returns table(metric text,metric_value bigint)
language sql stable security definer set search_path='' as $$
 with base as (
  select visitor_token,created_at from public.site_events
  where public.is_admin() and created_at>=now()-interval '30 days'
  and visitor_token is not null
 ), per_visitor as (
  select visitor_token,count(distinct created_at::date) as active_days from base group by visitor_token
 )
 select 'identified_browsers',count(*)::bigint from per_visitor
 union all select 'returning_browsers',count(*)::bigint from per_visitor where active_days>1
$$;
revoke all on function public.site_visitor_summary() from public;
grant execute on function public.site_visitor_summary() to authenticated;
create or replace function public.site_traffic_summary()
returns table(traffic_source text,event_count bigint)
language sql stable security definer set search_path='' as $$
 select coalesce(e.traffic_source,'unknown'),count(*)::bigint
 from public.site_events e
 where public.is_admin() and e.created_at>=now()-interval '30 days' and e.event_type='page_view'
 group by coalesce(e.traffic_source,'unknown') order by count(*) desc
$$;
revoke all on function public.site_traffic_summary() from public;
grant execute on function public.site_traffic_summary() to authenticated;
-- Purge old events (90-day maximum) with an actual scheduled job before launch.
-- Browser tokens only exist after opt-in and can be cleared by withdrawing consent.

-- GDPR operations: explicit withdrawal of previously collected browser-linked events.
-- Anonymous RPC accepts only a high-entropy random UUID. Do not reuse this token for other purposes.
create or replace function public.erase_visitor_events(p_visitor uuid)
returns void language plpgsql security definer set search_path='' as $$
begin
 if p_visitor is null then return; end if;
 delete from public.site_events where visitor_token=p_visitor;
end $$;
revoke all on function public.erase_visitor_events(uuid) from public;
grant execute on function public.erase_visitor_events(uuid) to anon,authenticated;
-- Install pg_cron (if available) and schedule:
-- select cron.schedule('invictas-events-retention','0 3 * * *',
--   $$delete from public.site_events where created_at < now() - interval '90 days'$$);
-- IMPORTANT: the event RPC is public and can be abused for fake counts.
-- Add server-side rate limiting / abuse protection before production.
