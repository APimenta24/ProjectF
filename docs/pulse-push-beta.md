# Pulse — notificações push (requisito Beta)

Estado: **subscrições por dispositivo e consentimento implementados no Supabase ProjectF; envio automático ainda não ativo**. Os avisos locais não equivalem a Web Push.

## Experiência pretendida
- Consentimento separado, opt-in explícito após uma ação relevante (por exemplo, criar o primeiro evento); nunca pedir autorização na primeira visita.
- Lembrete configurável de evento (ex.: 1 hora antes), objetivo com prazo e resumo semanal opcional. Preferências individuais, horário de silêncio, cancelar e editar.
- Notificações discretas: título genérico sem dados de ciclo, sintomas, refeições ou outra informação sensível no ecrã bloqueado.
- Ao tocar, abrir o evento correto após autenticação; ao terminar sessão, não expor informação privada.
- Mostrar claramente quando o navegador não suporta push ou quando a permissão foi recusada.

## Arquitetura necessária
1. Service worker do mesmo domínio e Push API com VAPID; não basta `Notification.requestPermission()` (que só permite notificações com a página ativa).
2. Guardar subscrições por utilizadora/dispositivo num backend autenticado com RLS e revogação; endpoint de subscrição e cancelamento com validação de sessão.
3. Serviço agendado para enviar eventos no instante correto, com zona horária e proteção contra duplicados. As chaves VAPID privadas ficam apenas no servidor.
4. Limpar subscrições inválidas, aplicar rate limiting, consentimento e retenção mínima. Testar Android/Chrome e iOS/Safari com aplicação instalada no ecrã principal, onde aplicável.
5. Validar envio com app fechada, mudança de dispositivo, permissões negadas, logout, eventos alterados/apagados e fuso horário.

**Implementação de 15/11/2026:** a base de dados oficial ProjectF foi expressamente autorizada. Criada `public.pulse_push_subscriptions` com RLS e operações autenticadas por dispositivo. O cliente só permite subscrição quando existir `NEXT_PUBLIC_PULSE_VAPID_PUBLIC_KEY` e a permissão do navegador for concedida. A chave privada nunca deve ser exposta no cliente.

**Ainda necessário para envio efetivo:** gerar e guardar par VAPID em variáveis de ambiente (privada apenas no servidor), implementar serviço de envio autenticado e agendador com fuso horário, quiet hours, deduplicação, limpeza de subscrições expiradas e gestão de erros. Não ativar um botão que prometa notificações agendadas antes de verificar entrega com a aplicação fechada. A subscrição por si só não envia mensagens.

**Validação final:** compilar, testar RLS com duas contas, consentimento, inscrição/revogação, Safari/iOS instalado, Chrome/Android, logout, duplicados e alterações de horário. Sem merge nem produção até autorização.


## Serviço de envio preparado — 15/11/2026
- Fila `public.pulse_push_jobs` no ProjectF, com RLS por utilizadora e estados de processamento.
- Código de Edge Function em `supabase/functions/pulse-push-dispatch/index.ts`; **não publicado**.
- A função exige `PULSE_PUSH_CRON_SECRET`, `PULSE_VAPID_PUBLIC_KEY`, `PULSE_VAPID_PRIVATE_KEY`, `PULSE_VAPID_SUBJECT`, `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` como segredos apenas no servidor.
- O cliente requer `NEXT_PUBLIC_PULSE_VAPID_PUBLIC_KEY` com a mesma chave pública.
- É necessário configurar um agendador seguro que faça POST autenticado à função (por exemplo, Supabase Cron + Vault), depois de a publicar com autorização explícita.
- Antes de ativar: corrigir a recuperação de jobs interrompidos no estado `processing`, garantir que erros por dispositivo não resultam em entrega perdida, validar deduplicação e horário de silêncio, configurar a criação de jobs a partir dos eventos/objetivos e testar em dispositivos reais.
- Não anunciar notificações push como funcionais antes destes passos.
