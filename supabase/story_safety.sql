-- INVICTAS editorial safety: apply in Supabase before enabling story submissions.
-- Proposals are NEVER publicly readable without separate protagonist approval.
alter table public.posts add column if not exists publication_type text not null default 'community';
alter table public.posts drop constraint if exists posts_publication_type_check;
alter table public.posts add constraint posts_publication_type_check
 check (publication_type in ('community','ambassador','story'));
alter table public.posts add column if not exists protagonist_approved_at timestamptz;
alter table public.posts add column if not exists protagonist_approved_version text;
-- Prevent arbitrary clients from setting approval, or directly publishing editorial stories.
create or replace function public.guard_story_publication()
returns trigger language plpgsql set search_path='' as $$
begin
 if tg_op='INSERT' then
  if new.status<>'pending' or new.protagonist_approved_at is not null or new.protagonist_approved_version is not null then
   raise exception 'New contributions must be pending and unapproved';
  end if;
 end if;
 if new.publication_type='story' and new.status='published' then
  if new.protagonist_approved_at is null or new.protagonist_approved_version is distinct from encode(digest(new.title||E'\n'||new.body,'sha256'),'hex') then
   raise exception 'Protagonist must approve the exact editorial version before publication';
  end if;
 end if;
 return new;
end $$;
drop trigger if exists guard_story_publication on public.posts;
create trigger guard_story_publication before insert or update on public.posts
for each row execute function public.guard_story_publication();
-- Author can explicitly approve only the exact submitted text (no editor approval by proxy).
create or replace function public.approve_my_story(p_post uuid)
returns boolean language plpgsql security definer set search_path='' as $$
declare approved_count integer;
begin
 update public.posts set protagonist_approved_at=now(),
 protagonist_approved_version=encode(digest(title||E'\n'||body,'sha256'),'hex')
 where id=p_post and author_id=(select auth.uid()) and publication_type='story' and status='pending';
 get diagnostics approved_count=row_count;
 return approved_count=1;
end $$;
revoke all on function public.approve_my_story(uuid) from public;
grant execute on function public.approve_my_story(uuid) to authenticated;
-- A moderator still needs to review and publish after protagonist approval.
-- A future editorial workflow must allow the protagonist to preview edited text before approving.
