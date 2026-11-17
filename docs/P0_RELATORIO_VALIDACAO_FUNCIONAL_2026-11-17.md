# INVICTAS — Relatório de validação funcional P0
Data: 2026-11-17
Âmbito: apenas lançamento funcional. Não acrescentar funcionalidades nem alterar linha editorial.
Estado: **NÃO FECHADO / NO-GO** até confirmação dos testes de sessão, navegador e permissões entre contas.

## Verificações realizadas
- PASS — Supabase: todas as tabelas no schema public têm RLS ativo (consulta de metadados).
- PASS — Supabase: RPCs administrativas selecionadas não têm EXECUTE para anon.
- PASS — Supabase: pulse_documents tem RLS e políticas de leitura/escrita por titular e consentimento.
- PASS — Supabase: site_events tem RLS ativo e nenhuma política; acesso direto é bloqueado pelas políticas.
- PASS — Vercel: deployment do commit 56559ae76ea922ace3a2f003e4dc4a498cfab80c em READY. READY prova build/deployment, não comportamento.
- REVISTO — RPCs admin_member_overview, approve_editorial_submission e publish_opportunity_submission incluem auth.uid() e public.is_admin() no corpo.
- REVISTO — track_site_event_verified exige parâmetros e valida tipos, mas a execução anónima de SECURITY DEFINER continua a ser um risco a avaliar com testes de abuso.

## Pontos por fechar
1. Permissões SQL: anon tem SELECT concedido em profiles e member_notifications; RLS de SELECT restringe a authenticated, mas recomenda-se retirar GRANT anon se não houver dependência justificada. Não foi feita alteração em produção.
2. Supabase Advisor: proteção de passwords comprometidas desativada; ativação pendente.
3. Avisos de SECURITY DEFINER acessível a anon/authenticated exigem análise completa das funções e testes de chamadas com JWT anon, membro e admin. O linter não prova exploração.
4. E2E real em navegador: registo, login, logout, recuperação, perfil, submissão, moderação, links, mobile, Pulse e consentimentos — não executado nesta auditoria.
5. GitHub Actions: os testes estáticos adicionados não tiveram execução de CI confirmada. Executar npm test, typecheck/build e confirmar logs.
6. Revisão de política de privacidade: texto atualizado para sincronização opcional, mas revisão legal e operacional por concluir.

## Critério de GO
- CI com npm test e build concluídos;
- teste E2E em desktop e mobile com contas visitante, membro e admin;
- acessos cruzados a dados privados bloqueados;
- políticas de privacidade e consentimentos correspondem ao funcionamento;
- nenhuma falha crítica/alta por resolver.

## Preservação
Não foi alterada a produção, a base de dados nem a linha editorial. Alterações ao código apenas na branch audit/p0-invictas-quality.
