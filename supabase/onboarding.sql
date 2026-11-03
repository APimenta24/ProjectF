-- Projeto F: dados de registo e personalização inicial
alter table public.member_preferences add column if not exists birth_date date;
alter table public.member_preferences add column if not exists gender text;
alter table public.member_preferences drop constraint if exists preferences_gender_values;
alter table public.member_preferences add constraint preferences_gender_values check (gender is null or gender in ('mulher','homem','nao_binario','outro'));
create or replace function public.new_profile() returns trigger language plpgsql security definer set search_path='' as $$
declare bd date; begin
 insert into public.profiles(id) values(new.id);
 if new.raw_user_meta_data ? 'birth_date' and nullif(new.raw_user_meta_data->>'birth_date','') is not null then
   bd:=(new.raw_user_meta_data->>'birth_date')::date;
   if bd>current_date - interval '18 years' then raise exception 'Registo reservado a maiores de 18 anos'; end if;
 end if;
 insert into public.member_preferences(user_id,birth_date,gender,interests,sports)
 values(new.id,bd,nullif(new.raw_user_meta_data->>'gender',''),
 coalesce((select array_agg(v) from jsonb_array_elements_text(case when jsonb_typeof(new.raw_user_meta_data->'interests')='array' then new.raw_user_meta_data->'interests' else '[]'::jsonb end) v),'{}'::text[]),
 coalesce((select array_agg(v) from jsonb_array_elements_text(case when jsonb_typeof(new.raw_user_meta_data->'sports')='array' then new.raw_user_meta_data->'sports' else '[]'::jsonb end) v),'{}'::text[]))
 on conflict(user_id) do nothing;
 return new;end$$;
-- A função de criação de perfil é executada automaticamente pelo trigger já existente.
