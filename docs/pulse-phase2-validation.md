# Pulse — Fase 2: execução isolada e critérios de segurança

Estado: preparação no ramo `feat/pulse-on-current-invictas`. **Migração aditiva aplicada ao Supabase ProjectF em 15/11/2026. Nenhuma sincronização ativa.**

## Ambiente
Por autorização expressa do responsável, as tabelas `public.pulse_documents` e `public.pulse_consents` foram criadas no Supabase oficial ProjectF (`xihmycqhqqspfxjpbuyh`), sem modificar tabelas existentes. RLS está ativo em ambas. A base é partilhada com a INVICTAS; testes de isolamento têm de usar contas próprias e dados fictícios.

## Etapas de execução
1. Criar contas de teste A e B no projeto atual, sem dados sensíveis reais.
2. Validar a migração aplicada: RLS e `auth.uid()` em SELECT/INSERT/UPDATE/DELETE; a leitura/escrita dos documentos exige consentimento por área. A revogação impede a leitura e escrita posteriores, mas permite apagar dados próprios.
3. Implementar um serviço autenticado que valide no servidor a área, o tipo/tamanho do JSON, o utilizador autenticado e os consentimentos específicos. O cliente não pode fornecer outro `user_id` para autorização.
4. Implementar sincronização por área com estados explícitos: local, a sincronizar, sincronizado, erro e conflito. Nunca apagar o armazenamento local antes de confirmação de escrita e releitura. Não sincronizar ciclo por defeito.
5. Testar isolamento entre contas A e B, acesso anónimo, revogação, exportação, eliminação, dois dispositivos e perda de rede. Rever RGPD e proteção dos dados sensíveis antes de testes com dados reais.
6. Só depois ativar subscrições Web Push com chaves VAPID, consentimento específico, horário local, cancelamento e conteúdo neutro no ecrã bloqueado. Não afirmar que as notificações estão ativas antes de teste ponta a ponta.

## Estado da PWA
A instalação tem interface própria e serviço worker com âmbito `/pulse/`. A funcionalidade «Testar notificação» só tenta mostrar um aviso se existir registo de service worker. **Não existe agendamento nem backend de envio.** Falta validar instalação Android/iOS, ícones PNG adequados, atualização e offline.

## Critério para ativação na interface
CI verde, build de pré-visualização pronto, QA em telemóvel e ambiente staging real com duas contas, revisão de segurança e aprovação expressa para produção.


## Fecho técnico — 15/11/2026
- A sincronização automática é **opcional** e limitada às áreas não sensíveis explicitamente listadas na interface.
- Escritas automáticas usam comparação do timestamp `updated_at` e não substituem alterações concorrentes; conflitos exigem decisão manual.
- A revogação do consentimento não apaga dados locais; existe opção explícita de eliminação remota.
- **Por validar antes de produção:** testes de duas contas, primeira sincronização, conflito simultâneo, offline, revogação, reinstalação, UI móvel e compilação da versão mais recente.
- **Não concluído:** push em segundo plano com a aplicação fechada, subscrição VAPID, agendamento no servidor e testes ponta-a-ponta. Lembretes locais não substituem push.
- Não fazer merge nem promover o ramo para produção até passar a validação e existir autorização explícita.
