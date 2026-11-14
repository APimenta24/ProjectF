# Pulse · Fase 1 — autonomia interna (12/11/2026)

## Objetivo
Desacoplar o Pulse da navegação da INVICTAS sem criar uma segunda aplicação produtiva, uma base de dados adicional, nem um sistema de contas novo.

## Integração
- `app/pulse/PulseWorkspace.tsx` é a fronteira de integração; recebe apenas `userId`, `member` e `onNavigate`.
- `app/page.tsx` importa o Pulse através dessa fronteira, em vez de importar diretamente o agente.
- O agente, as fases, as preferências e o diário do ciclo permanecem nos ficheiros existentes nesta primeira migração de baixo risco.
- Sem alteração do contrato de consentimento ou dos identificadores locais.
- A fronteira prepara a extração gradual de componentes; **não equivale a independência total do código nem da autenticação**.

## Protótipo interativo de experiência
- Rota `/pulse/prototipo`.
- Cinco percursos navegáveis: Início, Pulse, Registar, Evolução e Plano.
- Assinatura editorial, navegação responsiva e interações locais demonstrativas.
- **Os números e a agenda são fictícios.** A conversa é apenas simulada.
- Não acede ao Supabase, não usa `localStorage` nem envia dados para servidores através do código do protótipo.
- A rota não pede autenticação, portanto não deve incluir dados pessoais nem de saúde.
- O protótipo não substitui o Pulse funcional, nem constitui aprovação visual ou funcional.

## Portas de validação
1. Confirmar build da revisão mais recente e abrir a rota em desktop e telemóvel.
2. Rever tipografia, contraste, proporções, legibilidade e navegação com utilizadoras.
3. Verificar que a integração real no separador Pulse continua a funcionar.
4. Manter os testes E2E reais e a revisão P0 de privacidade para a fase pré-lançamento, conforme acordado.
5. Não fazer merge, publicação em produção ou alterações à base de dados sem autorização separada.

## Próxima extração
Mover gradualmente o estado, persistência e componentes do agente para `app/pulse/`, mantendo adaptadores temporários e testes de regressão. Evitar alterações de chaves de armazenamento durante a extração.
