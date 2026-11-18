-- INVICTAS P0: verificações de segurança apenas de leitura
-- Executar no SQL Editor do Supabase. Não altera dados, permissões nem políticas.
WITH checks AS (
  SELECT 'RLS ativo em todas as tabelas public' AS check_name,
    NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND NOT rowsecurity) AS passed
  UNION ALL
  SELECT 'RPCs administrativas inacessiveis a anon',
    NOT EXISTS (
      SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
      WHERE n.nspname='public'
        AND p.proname IN ('admin_member_overview','approve_editorial_submission','archive_opportunity','publish_opportunity_submission','site_analytics_summary','site_traffic_summary','site_visitor_summary')
        AND has_function_privilege('anon',p.oid,'EXECUTE')
    )
  UNION ALL
  SELECT 'Dados Pulse protegidos por RLS e politicas',
    (SELECT rowsecurity FROM pg_tables WHERE schemaname='public' AND tablename='pulse_documents')
    AND (SELECT count(*) >= 4 FROM pg_policies WHERE schemaname='public' AND tablename='pulse_documents')
  UNION ALL
  SELECT 'Sem privilegios anon concedidos em tabelas privadas',
    NOT EXISTS (
      SELECT 1 FROM information_schema.role_table_grants
      WHERE table_schema='public' AND grantee='anon'
        AND table_name IN ('profiles','member_preferences','pulse_documents','pulse_consents','member_notifications')
    )
  UNION ALL
  SELECT 'site_events com RLS sem leitura direta',
    (SELECT rowsecurity FROM pg_tables WHERE schemaname='public' AND tablename='site_events')
    AND NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='site_events')
)
SELECT check_name, CASE WHEN passed THEN 'PASS' ELSE 'REVIEW' END AS result FROM checks;
