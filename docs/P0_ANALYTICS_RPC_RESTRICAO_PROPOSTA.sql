-- INVICTAS P0 | proposta de restrição das RPCs legadas de analytics
-- NÃO executar automaticamente: a base Supabase é partilhada com produção.
-- Validar dependências, assinaturas e permissões no projeto antes da aplicação.
-- A aplicação atual usa apenas as versões *_verified, com segredo local.
-- REVOKE FROM PUBLIC é indispensável: PUBLIC inclui anon e authenticated.
BEGIN;
REVOKE EXECUTE ON FUNCTION public.track_site_event(text, text, uuid, text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.erase_visitor_events(uuid) FROM PUBLIC, anon, authenticated;
COMMIT;
-- Verificação pós-aplicação (esperado: false para as duas funções legadas):
-- SELECT has_function_privilege('anon', 'public.erase_visitor_events(uuid)', 'EXECUTE');
-- SELECT has_function_privilege('authenticated', 'public.erase_visitor_events(uuid)', 'EXECUTE');
-- SELECT has_function_privilege('anon', 'public.track_site_event(text,text,uuid,text)', 'EXECUTE');
-- SELECT has_function_privilege('authenticated', 'public.track_site_event(text,text,uuid,text)', 'EXECUTE');
-- Validar igualmente que as funções *_verified continuam acessíveis aos papéis necessários.
-- Se a assinatura de track_site_event diferir, corrigir esta proposta antes de executar.
