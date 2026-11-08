# INVICTAS — requisitos de privacidade e segurança antes do lançamento

Estado: **não validado para produção**. Este documento é uma lista de implementação, não um parecer jurídico.

## Implementado em código (sujeito a teste)
- Banner geral de cookies, recusa e gestão de preferências; analytics opcionais sem consentimento não são enviados pelo cliente.
- Contagens de analytics no Backoffice, com estimativa de navegadores distintos apenas mediante autorização.
- Pedido de eliminação dos eventos ligados ao identificador quando é retirado o consentimento (requer migração SQL aplicada).
- Cabeçalhos de segurança HTTP básicos.
- Submissões de histórias com estado pendente e migração de proteção da publicação editorial.

## Bloqueadores de lançamento
1. **Responsável pelo tratamento:** identificar entidade/nome, morada e contacto de privacidade; confirmar operadores e contratos com Supabase, Vercel e outros.
2. **Dados especiais e menores:** inventariar dados do Pulse, ciclo, saúde e perfis; definir bases legais, necessidade de AIPD/DPIA e regras de idade. Não recolher dados de menores antes da avaliação.
3. **Consentimentos editoriais:** criar revisão da versão final pela protagonista, registo auditável, autorização específica para imagem/voz, retirada e correção. A migração bloqueia publicação sem aprovação, mas ainda não há fluxo completo de revisão.
4. **Direitos RGPD:** implementar pedido de acesso/exportação, retificação, apagamento da conta e dados da comunidade, oposição, limitação e resposta dentro dos prazos legais. Confirmar eliminação em backups e processadores.
5. **Retenção:** ativar agendamento efetivo de eliminação dos analytics após 90 dias; definir prazos por categoria e mecanismo de eliminação de identificadores.
6. **Antiabuso:** proteger endpoints públicos de analytics com limites de taxa e medidas contra tráfego automatizado; confirmar políticas RLS de todas as tabelas e RPCs.
7. **Autenticação:** rever política de passwords, verificação de email, recuperação de conta, proteção de sessão e MFA obrigatório para administradores.
8. **Segurança técnica:** testes de autorização, XSS, CSRF, dependências, backups, recuperação, logs e segredos; aplicar CSP testada sem quebrar Supabase.
9. **Documentação:** política de privacidade definitiva, informação de cookies efetivamente utilizados, registo de atividades, bases legais, subprocessadores, transferências internacionais e processo de resposta a incidentes.
10. **Verificação:** executar SQL no Supabase, testar migrations em staging, compilar e testar fluxos de utilizador/admin; só depois fundir a branch e publicar.

## SQL por aplicar
- `supabase/schema.sql` se o projeto ainda não foi inicializado.
- `supabase/ambassador_posts.sql` conforme o estado da BD.
- `supabase/site_analytics.sql` (inclui funções de medição e eliminação).
- `supabase/story_safety.sql` (requer `pgcrypto` e testes).
Verificar a compatibilidade e a ordem em ambiente de teste. **Não executar às cegas em produção.**

## Nota de segurança
A aprovação editorial do autor ainda não está implementada na interface. A aplicação deve manter as histórias editoriais pendentes até existir um fluxo completo de revisão e consentimento. Não afirmar conformidade RGPD sem auditoria jurídica e técnica.
