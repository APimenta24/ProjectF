-- INVICTAS: editorial classification is set only by moderators.
-- User submissions remain pending, including those from ambassadors.
alter table public.posts add column if not exists publication_type text not null default 'community';
alter table public.posts drop constraint if exists posts_publication_type_check;
alter table public.posts add constraint posts_publication_type_check check(publication_type in ('community','ambassador'));
drop policy if exists "Posts create" on public.posts;
create policy "Posts create" on public.posts for insert to authenticated
 with check(author_id=(select auth.uid()) and status='pending' and publication_type='community');
-- Existing "Posts moderation" policy permits admins to classify and approve posts.
-- Before marking a post as 'ambassador', the editor must confirm the author is an official ambassador.
-- An editorial interview featuring someone else must not be published without separate documented permission.
