# INVICTAS — P0: segurança, revisão editorial e privacidade
Data: 2026-11-09. Ambiente: branch `feature/invictas-individual-playbook`, Supabase `ProjectF`.

## Alterações aplicadas
1. Removida a versão antiga `approve_editorial_submission(uuid)`, que não exigia revisão editorial e consentimento. Só resta a versão com `p_review_confirmed=true`, que verifica `is_admin()` e `consent_confirmed`.
2. As propostas editoriais exigem consentimento verdadeiro e limites de comprimento na base de dados, incluindo submissões diretas à API.
3. Retirado o acesso de utilizadores aos gatilhos internos `new_profile`, `notify_cms_archive` e `notify_content_moderation`.
4. O registo passou a exigir data de nascimento válida e idade mínima de 18 anos no gatilho de autenticação, independentemente do formulário.
5. Retirar artigos requer justificação; a autora é notificada se for uma terceira pessoa e houver identificação.
6. Os artigos do CMS têm campos de proveniência: `references_notes`, `image_credit`, `image_rights_confirmed`, `reviewed_by` e `reviewed_at`. O editor impede publicação manual sem fontes e, quando há imagem, sem crédito e confirmação de direitos. A leitura apresenta as referências e o crédito.
7. Testes de regressão de código adicionados em `tests/p0-guards.test.mjs` e pipeline de PR em `.github/workflows/p0-checks.yml`.

## Verificações efetivamente executadas
- Consultas de privilégios confirmaram uma única função de aprovação, inacessível a `anon`.
- Uma chamada real sob `SET ROLE anon` foi recusada pelo Postgres (`permission denied`).
- Uma chamada real sob `SET ROLE authenticated`, sem sessão de administrador, foi recusada (`Acesso negado`).
- Consulta de artigos públicos como `anon` funcionou, sem revelar rascunhos.
- O deployment de preview compilou para o commit de proveniência editorial; o pipeline mais recente precisa de estado final.
- Não foram criadas contas de teste nem efetuadas eliminações, emails de recuperação ou publicações reais.

## Riscos e verificações ainda obrigatórias antes de lançar
- **E2E com três identidades reais de teste**, sem dados pessoais: visitante, membro, administrador. Testar registo, sessão expirada, recuperação de palavra-passe, moderação, notificações, restauração, eliminação lógica e acesso após eliminação.
- **Segurança do Supabase:** `is_admin`, `track_site_event` e `erase_visitor_events` ainda aparecem nos avisos de funções privilegiadas anónimas. As duas últimas são intencionalmente públicas para analytics com consentimento e eliminação por token, mas precisam de teste de abuso/rate limit; a primeira só devolve verdadeiro para a conta admin. Outras funções `SECURITY DEFINER` são destinadas a membros autenticados, com verificação interna de permissões.
- **Auth:** ativar proteção contra palavras-passe comprometidas na consola Supabase; rever MFA da conta admin, expiração de JWT e revogação de sessões após eliminação lógica.
- **RGPD:** a página `/privacidade` ainda é provisória. Antes de lançamento, definir contacto válido, bases legais, subcontratantes, prazos de retenção por categoria e procedimento de acesso/apagamento. A eliminação lógica da conta não apaga automaticamente histórias e comentários.
- **Conteúdo:** rever manualmente cada artigo original e científico, a exatidão dos links e licenças das imagens. Não assumir que fotografias ilustrativas ou bibliografia já foram autorizadas.
- **Consentimento editorial:** o checkbox de revisão é uma declaração do administrador; o registo das autorizações de protagonistas e de fotografias deve ser guardado de forma verificável fora da imagem. Não publicar histórias de terceiros sem esse registo.
- **Operação:** nenhuma proposta real foi aprovada ou rejeitada durante esta auditoria. A fila de artigos e oportunidades ainda precisa de teste integral.

## Regras de retenção a formalizar
- Analytics consentidos: expurgo configurado aos 90 dias; confirmar execução periódica.
- Contas e perfis: desativação não equivale a apagamento. Identificar conteúdos publicados associados e decidir anonimização ou retirada caso a caso.
- Propostas, motivos de moderação e notificações: definir retenção proporcional e comunicar aos titulares antes do lançamento.
- Pulse: verificar armazenamento local, limpeza de dados no navegador e ausência de envio para analytics.

## Critério de conclusão do P0
Não declarar «pronto para lançamento» enquanto houver falhas de autorização, consentimentos por comprovar, falta de contacto de privacidade ou testes de ponta a ponta pendentes.
