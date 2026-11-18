# INVICTAS — Diagnóstico P0 verificável
Data: 17-11-2026
Ramo analisado: audit/p0-invictas-quality (derivado de feat/pulse-on-current-invictas).
Método: inspeção de código, documentos internos e metadados de deployments Vercel. Não houve sessão autenticada de navegação, testes com utilizadoras nem consultas RLS reais. Observação de código não equivale a reprodução de falha.

## Resumo executivo
**NO-GO para lançamento público.** O produto dispõe de percursos e ferramentas reais, mas ainda falta prova operacional de segurança, consistência de informação, E2E, UX e editorial. Pulse é complementar à INVICTAS.

## Matriz de problemas
| ID | Gravidade | Evidência | Impacto | Ação | Prova de fecho |
|---|---|---|---|---|---|
| D01 | Crítica de transparência | app/privacidade/page.tsx afirma que Pulse é exclusivamente local e sem sincronização; app/pulse/PulseAccountSync.tsx e lib/pulse-account-storage.ts implementam cópia manual e sincronização opcional para pulse_documents | Informação incompleta sobre destino de notas/check-ins/conversas | Corrigir texto, consentimentos e inventário de dados por área; revisão jurídica | Política corresponde aos fluxos reais; testes de consentimento e revogação |
| D02 | Alta | docs/P0_AUDITORIA_E_GATES_2026-11-09.md assinala testes RLS/Storage, contas e recuperação pendentes | Acesso indevido não excluído por teste | Executar matriz anon/membro/admin com contas sintéticas | Evidência de pedidos permitidos/negados, incluindo Storage |
| D03 | Alta | app/page.tsx ~105 k caracteres; concentra múltiplos domínios e ~23 ocorrências localStorage | Alterações arriscadas e manutenção difícil; não é prova de bug | Extrair por domínio após testes de regressão | Fluxos preservados e CI verde |
| D04 | Alta | app/privacidade/page.tsx continua versão de trabalho, sem contacto e retenção confirmados | Informação obrigatória incompleta | Validar responsável, canal, retenção, fornecedores, saúde, menores | Política revista e operacionalizada |
| D05 | Alta | docs/P0_AUDITORIA_E_GATES_2026-11-09.md e docs/ADMIN_ANALYTICS_E_TESTES.md indicam E2E não concluído | Percursos de adesão, participação e moderação não demonstrados | Testar com contas sintéticas no preview | Matriz E2E assinada |
| D06 | Média | .github/workflows/p0-quality.yml usa npm install; TODO lockfile e npm ci; workflow foi alargado às branches ativas | Reprodutibilidade do CI insuficiente | Confirmar lockfile e migrar para npm ci após revisão | Execução GitHub Actions verde e reproduzível |
| D07 | Média | app/page.tsx define nav Início, Comunidade, Descobrir, Oportunidades, Pulse e mapeia rótulos para secções internas anteriores | Possível confusão de arquitetura de informação; hipótese, não defeito confirmado | Testar descoberta de comunidade, conteúdo e oportunidades em mobile | Tarefas sem assistência e rótulos compreendidos |
| D08 | Alta | docs/AUDITORIA_PRODUTO_VALOR_2026-11-08.md identifica referências editoriais, direitos de imagem e oportunidades ainda por validar | Perda de confiança e riscos editoriais | Auditoria de conteúdo e autorizações | Checklist por conteúdo, URL e autorização |
| D09 | Média | app/pulse/PulseAccountSync.tsx permite cópia manual de notas e check-ins, mas a sincronização automática exclui estas áreas; conflitos resolvidos manualmente | Risco de expectativa errada sobre continuidade entre dispositivos | Testar cópia, recuperação, conflitos e mensagens | Sem perda de dados em cenários de dois dispositivos |
| D10 | Média | app/style.css tem regras mobile, focus-visible e reduced-motion; cobertura real não testada | Acessibilidade desconhecida, não necessariamente ausente | Testes 320/375/768px, teclado e leitor de ecrã | Registo de defeitos e correções com capturas |

## Percursos a testar
1. Visitante: entender proposta INVICTAS -> explorar conteúdo -> localizar oportunidade -> iniciar registo.
2. Membro: registo/login -> personalização do perfil -> descobrir conteúdo relevante -> participar na comunidade -> regressar.
3. Autora: submeter história/artigo -> consentimento -> estado pendente -> notificação de decisão -> autorização final de publicação.
4. Proponente: submeter oportunidade -> revisão administrativa -> publicação com URL, prazo e entidade verificadas.
5. Admin: autenticação -> lista pendentes -> verificação -> aprovar/rejeitar -> motivo -> notificação.
6. Pulse complementar: optar por armazenamento local -> consentimento explícito para cópia na conta -> conflitos -> revogar/apagar -> confirmar estado.

## Ordem de correção
**Imediata:** D01, D02, D04, D05.
**Depois:** D08, D09, D06.
**Após estabelecer testes de regressão:** D03 e D07/D10 conforme fricção observada.

## Limitações e decisões
- Deployments de preview audit/p0-invictas-quality READY, sem comprovação de comportamento em browser.
- Não houve testes reais de RLS, ecrãs mobile, acessibilidade, recuperação de conta ou utilizadoras; não os assinalar como aprovados.
- Não adicionar funcionalidades; primeiro fechar confiança, privacidade, segurança e fluxos existentes.
- Sem alterações a main, produção ou base de dados.
