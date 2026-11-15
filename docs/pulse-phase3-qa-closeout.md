# Pulse — fecho técnico da Fase 3 (15/11/2026)

## Validado automaticamente
- `npm test`, `npx tsc --noEmit`, `npm run build`: verificados pelos workflows `INVICTAS P0 checks` e `P0 quality gate` no commit 77b6c2dfbe7d98a4293ca5ef1d7d88c7b9ddc443.
- Vercel preview do mesmo commit: READY.
- RLS ativado nas quatro tabelas Pulse: `pulse_documents`, `pulse_consents`, `pulse_push_subscriptions`, `pulse_push_jobs`. Políticas de propriedade por `auth.uid() = user_id` inspecionadas.
- Correção de consentimento push por dispositivo e rollback de nova subscrição falhada coberta por testes estáticos.

## QA manual necessário antes de considerar o produto validado
Usar **duas contas de teste distintas (A/B)**, com dados fictícios, e dois navegadores/dispositivos. Não usar dados reais de saúde.
1. Entrar em A, criar evento com hora, objetivo com prazo e check-in. Confirmar persistência após recarregar.
2. Entrar em B, confirmar que os registos de A não aparecem. Criar dados em B; regressar a A e confirmar isolamento.
3. Em A, ativar armazenamento da conta, guardar cópia manual e recuperar noutro dispositivo; confirmar cada área e a necessidade de consentimento explícito para notas/check-ins.
4. Testar diferenças entre dispositivos: criar alterações distintas no mesmo registo e confirmar que a sincronização automática **não** substitui dados em conflito.
5. Revogar autorização, com e sem eliminação remota; verificar que os dados locais são preservados e que o acesso remoto fica bloqueado. Reautorizar e verificar o comportamento.
6. Testar agenda nas vistas Dia/Semana/Mês, criação/edição/eliminação de eventos, objetivos e notificações no próprio dispositivo.
7. Confirmar que o diário do ciclo continua separado, que os dados sensíveis não surgem nas notificações e que a opção de apagar dados locais não elimina o diário do ciclo.
8. Verificar ecrãs móveis (Android Chrome, iOS Safari quando disponível): navegação, formulários, contraste, toque, teclado e instalação PWA.
9. Testar logout/login, offline/online, permissões de notificação recusadas e erros de rede.

Registar **passou / falhou / não testado**, dispositivo, conta de teste, passos e captura para cada caso. Sem estes resultados não se pode afirmar que o QA funcional está concluído.

## Separado para a fase de credenciais e ativação
- Configurar VAPID, segredo do agendador, serviço de envio e agendamento seguro.
- Validar Edge Function, cron, entrega real com aplicação fechada, cancelamento e múltiplos dispositivos.
- Rever avisos do advisor de segurança do projeto: existem avisos relativos a funções e tabelas fora do módulo Pulse; exigem avaliação própria antes de uma publicação geral.
- Não ativar envio real, fazer merge ou promover para produção sem autorização.

**Critério de fecho:** workflows verdes + preview READY + matriz manual executada sem defeitos bloqueantes. Até lá, o fecho é **técnico/automatizado**, não validação funcional integral.
