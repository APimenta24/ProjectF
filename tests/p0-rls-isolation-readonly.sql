-- INVICTAS P0: auditoria estrutural de isolamento (apenas leitura)
-- Não substitui testes E2E com dois JWTs reais.
WITH requirements(tablename, cmd, fragment) AS (
 VALUES
 ('profiles','SELECT','auth.uid()'),
 ('member_notifications','SELECT','auth.uid()'),
 ('editorial_submissions','INSERT','auth.uid()'),
 ('editorial_submissions','SELECT','auth.uid()'),
 ('opportunity_submissions','INSERT','auth.uid()'),
 ('opportunity_submissions','SELECT','auth.uid()'),
 ('pulse_consents','SELECT','auth.uid()'),
 ('pulse_documents','SELECT','auth.uid()'),
 ('pulse_documents','INSERT','auth.uid()')
)
SELECT r.tablename, r.cmd,
 CASE WHEN EXISTS (
 SELECT 1 FROM pg_policies p
 WHERE p.schemaname='public' AND p.tablename=r.tablename AND p.cmd=r.cmd
 AND 'authenticated'=ANY(p.roles)
 AND (coalesce(p.qual,'') || coalesce(p.with_check,'')) LIKE '%'||r.fragment||'%'
 ) THEN 'PASS' ELSE 'REVIEW' END AS result
FROM requirements r ORDER BY r.tablename,r.cmd;
