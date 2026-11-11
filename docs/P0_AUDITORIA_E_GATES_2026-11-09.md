# INVICTAS — P0: auditoria e portas de lançamento
Data: 2026-11-09. Âmbito atualizado: branch feat/pulse-on-current-invictas. Não equivale a certificação de segurança ou parecer jurídico.

## Atualização de 11 de novembro de 2026
- **Aplicada no Supabase** a migração `restrict_legacy_analytics_rpc_execution`: funções legadas `track_site_event` e `erase_visitor_events` sem EXECUTE para PUBLIC, anon ou authenticated. Verificação SQL pós-migração confirmou false para ambos os papéis; funções `*_verified` mantêm EXECUTE. Os alertas de execução privilegiada passaram de 18 para 14 (não equivale a ausência de riscos).
- Política `/privacidade` reescrita com dados tratados, finalidades, fundamentos propostos, direitos, fornecedores identificados, armazenamento local Pulse e ressalvas explícitas sobre dados de saúde. **Ainda não é uma política definitiva**, por faltar informação operacional confirmada.
- Testes estáticos atualizados na branch, mas sem CI/E2E confirmado nesta atualização.
- Por decisão do promotor, testes reais ficam para a fase pré-lançamento; continuam bloqueadores de GO, não bloqueadores de trabalho na branch.

## Alterações implementadas
- O backoffice exige confirmação expressa de revisão de autoria, consentimento, referências e dados pessoais antes de aprovar propostas de artigos.
- O backoffice exige confirmação de entidade, URL oficial, prazo e custos antes de aprovar oportunidades.
- As propostas de artigos exigem consentimento explícito no formulário e na base de dados. A função privilegiada de aprovação exige confirmação da revisão, regista reviewed_by e reviewed_at e não publica propostas sem consentimento.
- Testes estáticos de segurança e integridade editorial em tests/p0-smoke.test.mjs; comando npm test.
- Workflow GitHub Actions: npm ci, npm test, TypeScript e build. Estes testes NÃO substituem E2E.

## Bloqueadores antes de abertura pública
### Segurança e contas
- Testar com três sessões distintas: anónima, membro e administradora. Confirmar que membro não lista utilizadores, não aprova, não elimina terceiros nem lê notificações privadas.
- Verificar envio real de email de recuperação e expiração do link, incluindo proteção contra enumeração/abuso.
- Confirmar que eliminação lógica da conta revoga sessões e tokens em tempo aceitável; testar pedidos de apagamento de dados e preservação legal de registos.
- **Resolvido para RPCs legadas de analytics:** acesso anónimo e autenticado revogado e verificado. **Ainda por validar:** limites de frequência, autorização e exposição das RPCs verificadas e `is_admin` (alertas residuais não equivalem automaticamente a vulnerabilidades).
- Verificar RLS de cada tabela com pedidos reais autenticados e anónimos; confirmar políticas do Storage e ficheiros de fotografias.
- Configurar alertas, logs de erros e backup/restore documentado.

### Moderação e consentimento
- Testar submissão de conversa, história, artigo e oportunidade; aprovação, rejeição com motivo, retirada posterior, restauração e notificação à autora.
- Para histórias reais, a aceitação inicial da proposta NÃO substitui autorização expressa da protagonista para a versão final e imagens; manter bloqueio de publicação até fluxo comprovado.
- Revisão editorial deve comprovar direitos de utilização de cada imagem, atribuição, precisão factual e referências, especialmente saúde, nutrição e psicologia.
- Os controlos de confirmação no backoffice ajudam a operação; a validação de qualidade é humana.

### Privacidade e conformidade
- A página /privacidade tem agora uma versão de trabalho abrangente; continua não pronta para lançamento até preencher informação em falta e obter revisão jurídica.
- Completar contacto de privacidade, fornecedores/subcontratantes, bases legais, retenção, transferências, pedidos de titulares, resposta a incidentes e política para menores e dados de saúde.
- Rever Pulse: confirmar por teste que os dados não são enviados à base de dados ou analytics.
- Testar recusa de analytics, revogação e apagamento do identificador local/histórico; confirmar período de retenção de 90 dias.

### Produto e editorial
- Verificar individualmente todas as ligações bibliográficas dos artigos em app/editorial.ts e lib/editorial.ts; confirmar correspondência entre fonte e afirmação, datas, direitos e autoria.
- Não publicar oportunidades não verificadas nem testemunhos fictícios.
- Validar navegação em telemóvel, teclado, leitor de ecrã, contraste, formulários, imagens, links externos e desempenho.
- Testar os fluxos completos no ambiente de preview com contas de teste, sem usar dados pessoais reais.

## Matriz de testes E2E exigidos
| Caso | Anónimo | Membro | Admin |
| --- | --- | --- | --- |
| Ver conteúdos publicados | Permitido | Permitido | Permitido |
| Ler proposta privada de terceiro | Negado | Negado | Permitido |
| Criar proposta | Pedir login | Pending | Pending |
| Aprovar artigo/oportunidade | Negado | Negado | Permitido após revisão |
| Consultar utilizadores | Negado | Negado | Permitido |
| Eliminar outra conta | Negado | Negado | Permitido com confirmação e restrições |
| Ler notificação alheia | Negado | Negado | Não através da UI pessoal |
| Revogar analytics | Permitido | Permitido | Permitido |

## Fecho documental e operacional ainda necessário
- **Contacto:** criar e testar um endereço de email de privacidade antes de o divulgar. Não inventar um contacto.
- **Subcontratantes:** confirmar contratos/DPA, regiões de alojamento, transferências e subprocessadores de Supabase e Vercel, incluindo logs, autenticação e emails transacionais.
- **Retenção:** definir e documentar por categoria os prazos de contas, conteúdos, moderação, analytics, logs e backups; comprovar eliminação efetiva. Não anunciar 90 dias sem confirmar a política técnica em produção.
- **Dados sensíveis:** avaliar artigo 9.º RGPD, consentimentos específicos e necessidade de AIPD para o Pulse antes de abertura pública ou autonomia comercial.
- **Direitos e incidentes:** definir canal de receção, identidade, responsáveis, registo de pedidos, prazos de resposta, eliminação, recuperação e notificação de incidentes.
- **Menores e direitos de imagem:** validar idade mínima e autorizações finais de testemunhos e imagens.
- **Validação pré-lançamento adiada por decisão expressa:** três perfis (anónimo/membro/admin), RLS/Storage, recuperação de conta, consentimento/revogação de analytics, exportação e apagamento Pulse, acessibilidade e fluxo editorial completo.
- **CI:** obter resultado verde de npm test, TypeScript e build; testes estáticos não substituem testes reais.

## Critério de GO
Todos os bloqueadores críticos fechados, testes E2E aprovados, revisão editorial concluída, privacidade final publicada e validação de funcionamento em produção. Até lá: **NO-GO para lançamento público**.
