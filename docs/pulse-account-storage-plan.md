# INVICTAS Pulse — sincronização por conta (plano de implementação)

**Estado: apenas preparação em GitHub.** Não aplicar em produção. O projeto Supabase de validação continua inativo por limite de projetos gratuitos. O ficheiro `supabase/pulse_staging_schema.sql` é uma proposta para ambiente separado; **não é uma migração executada**.

## Contrato de armazenamento

Cada documento pertence a `auth.users.id` e tem uma área: `agent`, `checkins`, `goals`, `agenda_alerts`, `reminders`, `wellbeing`, `cycle`. O par `(user_id, area)` é único. A autenticação Supabase determina o `user_id`; nunca aceitar IDs de outras contas enviados pelo cliente. O JSON preserva inicialmente os formatos atuais, sujeitos a validação de esquema e limites de tamanho no servidor antes do lançamento.

| Área | Fonte atual (localStorage) | Condição |
| --- | --- | --- |
| agent (configuração, treinos, planos, conversa opcional) | `invictas-pulse-agent-v2-<userId>` | consentimento Pulse |
| checkins | `invictas-pulse-phase1-v2-<userId>` | consentimento Pulse |
| goals | `invictas-pulse-phase2-v2-<userId>` | consentimento Pulse |
| agenda_alerts | `invictas-pulse-agenda-alerts-v1-<userId>` | avisos opcionais, sem push |
| reminders | `invictas-pulse-reminders-v1-<userId>` | consentimento Pulse |
| wellbeing | `invictas-pulse-wellbeing-choice-v2-<userId>` | consentimento específico |
| cycle | `invictas-cycle-choice-v3-<userId>` | consentimento específico, **não incluir no contexto do agente por defeito** |

## Antes de ligar a interface

1. Criar projeto de staging separado; executar o SQL nele e inspecionar RLS, grants e avisos de segurança. Não usar o projeto partilhado de produção.
2. Implementar uma API/camada de dados autenticada para leitura, escrita, exportação e eliminação, com validação estrita de área, payload, tamanho e consentimentos. O RLS do SQL só restringe propriedade; **não impõe por si só consentimentos**.
3. Para `cycle_agent_access`, verificar autorização explícita no servidor **em cada acesso** e nunca enviar dados de ciclo ao agente ou a fornecedores externos por defeito. Revogação deve impedir novos acessos.
4. Tratar o ciclo e outros dados de saúde como informação especialmente sensível: avaliar base legal RGPD, minimização, retenção, acesso administrativo, registos de acesso, encriptação adequada e eventual AIPD antes de produção. Não confiar apenas na encriptação em repouso do fornecedor.
5. Substituir `localStorage` por sincronização autenticada, por área, com estados de carregamento/erro, resolução de conflitos e estratégia offline. **Não apagar dados locais antes de confirmação de escrita e leitura no servidor**. Sem utilizadoras reais do Pulse, pode optar-se por não migrar dados experimentais.
6. Criar testes reais com contas A e B: A cria/lê/edita/apaga; B não consegue ler/alterar A, mesmo com pedido manipulado; utilizador anónimo não acede; logout limpa estado; dois dispositivos sincronizam; revogação de consentimento e eliminação funcionam.
7. Fazer teste de regressão mobile e de falha de rede. Só depois considerar merge e configuração de produção, com aprovação explícita.

## Critérios de aceitação

- Dados associados à conta e acessíveis em dois dispositivos após login.
- RLS validado em base de dados real com duas identidades.
- Consentimentos independentes de bem-estar/ciclo, exportação e eliminação verificadas.
- Sem fuga de dados entre contas nem acesso ao ciclo pelo agente sem autorização.
- CI verde, staging aprovado e produção inalterada até autorização.

## Limites atuais

Os testes existentes são maioritariamente smoke tests estáticos; não substituem testes de integração contra Supabase. Esta proposta não implementa ainda sincronização, encriptação específica por campo, consentimento efetivo no servidor, migração ou notificações push.
