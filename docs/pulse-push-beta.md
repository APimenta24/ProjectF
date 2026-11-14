# Pulse — notificações push (requisito Beta)

Estado: **não implementado**. Os avisos atuais são internos à página. Não confundir com Web Push.

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

**Dependência bloqueante:** infraestrutura de backend de testes disponível e isolada. Não usar a base de produção partilhada sem autorização explícita. O desenvolvimento da agenda não depende desta etapa.
