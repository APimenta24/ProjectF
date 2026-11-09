# INVICTAS — P0: auditoria e portas de lançamento
Data: 2026-11-09. Âmbito: branch feature/invictas-individual-playbook. Não equivale a certificação de segurança ou parecer jurídico.

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
- Auditar RPCs SECURITY DEFINER sinalizadas pelo Supabase: is_admin, track_site_event e erase_visitor_events têm acesso anónimo intencional ou potencialmente excessivo. Validar rate limits, autorização, integridade e exposição.
- Verificar RLS de cada tabela com pedidos reais autenticados e anónimos; confirmar políticas do Storage e ficheiros de fotografias.
- Configurar alertas, logs de erros e backup/restore documentado.

### Moderação e consentimento
- Testar submissão de conversa, história, artigo e oportunidade; aprovação, rejeição com motivo, retirada posterior, restauração e notificação à autora.
- Para histórias reais, a aceitação inicial da proposta NÃO substitui autorização expressa da protagonista para a versão final e imagens; manter bloqueio de publicação até fluxo comprovado.
- Revisão editorial deve comprovar direitos de utilização de cada imagem, atribuição, precisão factual e referências, especialmente saúde, nutrição e psicologia.
- Os controlos de confirmação no backoffice ajudam a operação; a validação de qualidade é humana.

### Privacidade e conformidade
- A página /privacidade é expressamente provisória e não está pronta para lançamento.
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

## Critério de GO
Todos os bloqueadores críticos fechados, testes E2E aprovados, revisão editorial concluída, privacidade final publicada e validação de funcionamento em produção. Até lá: **NO-GO para lançamento público**.
