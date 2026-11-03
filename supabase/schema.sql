-- Executar no SQL Editor do Supabase depois de criar o projeto.
create extension if not exists pgcrypto;
create table if not exists public.profiles(id uuid primary key references auth.users(id) on delete cascade,display_name text,role text not null default 'member' check(role in('member','admin')),created_at timestamptz not null default now());
create table if not exists public.posts(id uuid primary key default gen_random_uuid(),author_id uuid not null references public.profiles(id) on delete cascade,title text not null check(char_length(title) between 3 and 180),body text not null check(char_length(body) between 3 and 10000),topic text not null,status text not null default 'pending' check(status in('pending','published','hidden')),created_at timestamptz not null default now());
create table if not exists public.contents(id uuid primary key default gen_random_uuid(),author_id uuid not null references public.profiles(id),title text not null,summary text not null default '',kind text not null check(kind in('artigo','video','curso')),topic text not null,published boolean not null default false,created_at timestamptz not null default now());
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path='' as $$select exists(select 1 from public.profiles where id=(select auth.uid()) and role='admin')$$;
create or replace function public.new_profile() returns trigger language plpgsql security definer set search_path='' as $$begin insert into public.profiles(id) values(new.id);return new;end$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.new_profile();
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.contents enable row level security;
create policy "Profiles read" on public.profiles for select to authenticated using(id=(select auth.uid()) or public.is_admin());
create policy "Profiles self update" on public.profiles for update to authenticated using(id=(select auth.uid())) with check(id=(select auth.uid()) and role='member');
revoke update on public.profiles from authenticated;
grant update(display_name) on public.profiles to authenticated;
create policy "Posts read" on public.posts for select to anon,authenticated using(status='published' or (select auth.uid())=author_id or public.is_admin());
create policy "Posts create" on public.posts for insert to authenticated with check(author_id=(select auth.uid()) and status='pending');
create policy "Posts moderation" on public.posts for update to authenticated using(public.is_admin()) with check(public.is_admin());
create policy "Contents read" on public.contents for select to anon,authenticated using(published=true or public.is_admin());
create policy "Contents insert" on public.contents for insert to authenticated with check(public.is_admin() and author_id=(select auth.uid()));
create policy "Contents update" on public.contents for update to authenticated using(public.is_admin()) with check(public.is_admin());
-- Promover a primeira administradora exclusivamente no SQL Editor:
-- update public.profiles set role='admin' where id=(select id from auth.users where email='EMAIL_ADMIN');
