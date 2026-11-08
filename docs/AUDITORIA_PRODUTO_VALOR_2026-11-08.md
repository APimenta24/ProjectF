# INVICTAS — auditoria de preparação de lançamento (08-11-2026)

## Verificado
- A Vercel marcou como READY o deployment do commit 6510d219 (formulário de propostas, moderação e CSS). READY confirma compilação e deploy, não valida operações Supabase.
- Existem 6 artigos em app/editorial.ts e 6 artigos em lib/editorial.ts. Têm referências externas declaradas, mas a exatidão de cada ligação e a adequação de cada citação exigem revisão editorial individual.
- As oportunidades públicas vêm da tabela public.opportunities com status='published'. O código omite oportunidades cujo deadline_at já passou.
- As submissões da comunidade são separadas da tabela pública; exigem autenticação, estado pending, e políticas RLS. A aprovação usa função RPC com verificação de administrador.
- O backoffice tem controlos para carregar propostas pendentes, aprovar e rejeitar.
- Histórias reais não devem ser substituídas por testemunhos inventados.

## Bloqueadores antes de disponibilizar a público
1. Aplicar e testar as migrações SQL no Supabase: schema.sql, opportunities.sql, opportunity_submissions.sql, ambassador_posts.sql, story_safety.sql e site_analytics.sql; verificar dependências, pgcrypto e políticas RLS. Não há confirmação de aplicação em produção.
2. Testar contas anónima, autenticada e administradora: submissão, tentativa de publicação direta, aprovação, rejeição, expiração, URLs inválidos, remoção de conta.
3. Rever e publicar política de privacidade final com responsável pelo tratamento, contacto e operadores. Definir tratamento de dados sensíveis, menores, direitos RGPD e retenção efetiva.
4. Concluir fluxo de aprovação final da protagonista para histórias editadas; a proteção SQL existente pode impedir a publicação sem fluxo de aprovação.
5. Verificar e rever as 12 peças editoriais e referências; assinar como equipa editorial e identificar revisões especializadas quando necessárias.
6. Publicar oportunidades reais verificadas, com prazo e ligação oficial. Não usar oportunidades fictícias para preencher o catálogo.
7. Confirmar domínios, variáveis de ambiente, redirecionamentos, cookies, mobile, acessibilidade, antiabuso e recuperação de falhas.
8. Implementar testes automatizados e validar uma sessão de testes de ponta a ponta; atualmente package.json não contém comando test.
9. Rever UX: navegação, publicação de histórias, conteúdo de retorno, indicação de data de verificação das oportunidades e comunicação de rejeição de propostas.
10. Só depois fundir a branch de desenvolvimento e promover para produção.

## Proposta de lançamento com valor
- Conhecimento: destacar 6 artigos com referências verificadas, revistos e úteis desde o primeiro acesso.
- A Voz Delas: iniciar com convites e publicar apenas histórias aprovadas pelas protagonistas.
- Oportunidades: catálogo pequeno mas real; submissão gratuita e moderada.
- Pulse: ferramenta opcional, não a promessa central; rever tratamento de dados pessoais antes da divulgação.
- Comunidade: primeiras 30 mulheres convidadas individualmente, medir participação voluntária sem fabricar métricas.

## Critério de conclusão
Produto pronto apenas quando (a) a compilação estiver READY no commit final, (b) SQL aplicado e testes de permissões aprovados, (c) privacidade/segurança resolvidas, (d) conteúdos e oportunidades verificados e (e) fluxos de participação funcionarem de ponta a ponta.
