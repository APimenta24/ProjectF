-- INVICTAS P0 — endurecimento das permissões de duas tabelas privadas
-- Preparado para revisão; NÃO executar sem autorização para alterar a base de dados ativa.
-- As políticas RLS atuais já restringem leitura, mas os GRANTs anon são desnecessários.
-- A função new_profile (trigger SECURITY DEFINER) e as chamadas autenticadas mantêm os seus privilégios.
BEGIN;
REVOKE ALL PRIVILEGES ON TABLE public.profiles FROM anon;
REVOKE ALL PRIVILEGES ON TABLE public.member_notifications FROM anon;
COMMIT;

-- Pós-aplicação:
-- SELECT table_name, privilege_type FROM information_schema.role_table_grants
-- WHERE table_schema='public' AND grantee='anon'
--   AND table_name IN ('profiles','member_notifications');
-- Esperado: zero linhas.
