# Pulse — Fase 2: execução isolada e critérios de segurança

Estado: preparação no ramo `feat/pulse-on-current-invictas`. **Nenhuma migração aplicada. Nenhuma sincronização ativa.**

## Ambiente
A conta Supabase tem um projeto ProjectF ativo (partilhado/produção), um projeto 24 | SportsManagement ativo e um projeto 24 P12 Validation inativo. **Nenhum destes é um ambiente Pulse staging isolado e autorizado.** Não aplicar `supabase/pulse_staging_schema.sql` a nenhum deles. Criar um projeto separado para Pulse, ou aprovar expressamente um ambiente descartável que não contenha dados de outros projetos.

## Etapas de execução
1. Criar staging independente, com Auth configurado e contas de teste A e B.
2. Rever o SQL existente: RLS em todas as tabelas, `USING` e `WITH CHECK` por `auth.uid()`, grants mínimos. Verificar que o consentimento não é imposto pelo RLS existente.
3. Implementar um serviço autenticado que valide no servidor a área, o tipo/tamanho do JSON, o utilizador autenticado e os consentimentos específicos. O cliente não pode fornecer outro `user_id` para autorização.
4. Implementar sincronização por área com estados explícitos: local, a sincronizar, sincronizado, erro e conflito. Nunca apagar o armazenamento local antes de confirmação de escrita e releitura. Não sincronizar ciclo por defeito.
5. Testar isolamento entre contas A e B, acesso anónimo, revogação, exportação, eliminação, dois dispositivos e perda de rede. Rever RGPD e proteção dos dados sensíveis antes de testes com dados reais.
6. Só depois ativar subscrições Web Push com chaves VAPID, consentimento específico, horário local, cancelamento e conteúdo neutro no ecrã bloqueado. Não afirmar que as notificações estão ativas antes de teste ponta a ponta.

## Estado da PWA
A instalação tem interface própria e serviço worker com âmbito `/pulse/`. A funcionalidade «Testar notificação» só tenta mostrar um aviso se existir registo de service worker. **Não existe agendamento nem backend de envio.** Falta validar instalação Android/iOS, ícones PNG adequados, atualização e offline.

## Critério para produção
CI verde, build de pré-visualização pronto, QA em telemóvel e ambiente staging real com duas contas, revisão de segurança e aprovação expressa para produção.
