# Auditoria Pulse — 11 novembro 2026

**Âmbito:** leitura estática de `app/PulseAgent.tsx`, `app/PulsePhaseOne.tsx`, `app/PulsePhaseTwo.tsx`, `app/PulsePreferences.tsx` e `app/CycleJournal.tsx`. Não foram executados testes E2E. Não é parecer clínico ou certificação de segurança.

## Decisão
**Consolidar o Pulse no produto atual antes de considerar separação.** O código tem módulos e armazenamento próprios, mas depende da identidade da INVICTAS e da navegação/perfil da aplicação principal. Uma aplicação autónoma requer autenticação, política de privacidade, infraestrutura e suporte próprios, além de validação de mercado.

## P0 — privacidade
1. **Corrigido nesta branch:** os módulos PhaseOne e PhaseTwo restauravam dados do armazenamento local sem testar o consentimento ativo. Agora limpam o estado e não leem dados persistidos quando `consent=false`. O evento de alteração de preferências também limpa os estados quando não há consentimento.
2. **Já implementado:** chaves locais por `userId`; consentimento para gravação do agente, check-ins e objetivos; exportação e eliminação do agente e fases; diário do ciclo com controlos separados; nenhum pedido de rede direto nos cinco módulos inspecionados.
3. **Risco residual:** dados do Pulse e ciclo guardados em `localStorage`, sem encriptação própria. O isolamento por chave não é uma fronteira de segurança entre pessoas com acesso ao mesmo perfil de navegador, nem protege contra scripts maliciosos no mesmo domínio.
4. **Risco residual:** o diário do ciclo tem consentimento próprio, independente do consentimento geral do Pulse. Isto é intencional na interface, mas requer explicação muito clara e teste de revogação, importação, exportação e apagamento.
5. **Antes do lançamento:** validar tecnicamente que não há envio de conteúdo sensível a analytics, logs, IA remota ou serviços externos; confirmar condições do artigo 9.º do RGPD e avaliar AIPD.

## P1 — coerência e robustez
- Uniformizar os controlos de privacidade entre Perfil, agente e diário do ciclo; evitar que a utilizadora interprete «apagar dados Pulse» como eliminação do ciclo.
- Testar troca de conta no mesmo navegador, atualização do consentimento, limites de armazenamento, importação de ficheiros inválidos e recuperação após falhas.
- Rever estados de erro de exportação e eliminação; a interface não deve anunciar sucesso quando uma operação de armazenamento falha.
- Rever as mensagens do assistente para não sugerirem diagnóstico ou prescrição individual de saúde.
- Rever consistência visual, navegação mobile, acessibilidade e contraste após fechar a base funcional.

## Estratégia de produto
A eventual app Pulse independente deve ser avaliada com uma proposta de valor específica, privacidade reforçada e modelo de negócio transparente. **Não ativar publicidade baseada em dados de saúde ou ciclo**. Separação técnica, publicidade e monetização ficam fora deste P0.

## Critérios de GO (pré-lançamento, adiados por decisão do promotor)
- Testes reais com contas distintas e dispositivos/navegadores distintos;
- Testes de consentimento, revogação, exportação e apagamento de todos os módulos;
- Verificação de ausência de transferência indevida de dados privados;
- Verificação de CI: testes, TypeScript e build;
- Política de privacidade e bases legais confirmadas; revisão jurídica dos dados sensíveis.

**Estado:** auditoria estática concluída; correção pontual aplicada na branch; E2E e GO não concluídos.

## Consolidação funcional + estética — implementação na branch (11/11/2026)
- **Início:** três percursos principais com cartões informativos (conversar, registar, evolução); agenda e objetivos secundários.
- **Conversa:** cabeçalho contextual, sugestões identificadas, área de conversa e campo de envio com linguagem consistente.
- **Registo:** percurso visual em duas etapas (modalidade e detalhes) sem alterar os dados recolhidos nem a lógica de gravação.
- **Evolução:** contexto antes dos indicadores, cartões de métricas harmonizados e preservação do aviso sobre ausência de registos.
- **Planeamento:** entrada visual alinhada com os restantes módulos, sem alteração dos fluxos de agenda/objetivos.
- **Privacidade:** erro de apagamento do agente já não é ocultado; a interface só confirma sucesso após verificar a remoção das três chaves locais.
- **Responsividade e acessibilidade:** CSS para mobile, estados de foco e movimento reduzido.
- **Testes estáticos:** acrescentadas asserções sobre hierarquia visual, ligações entre percursos e consentimento. **Não foram executados nem substituem validação em navegador.**

**Limites desta etapa:** não foram redesenhados os componentes internos de agenda/objetivos/check-in, nem verificados visualmente os diferentes tamanhos de ecrã. Não houve merge, deploy ou alteração à base de dados.

## Pulse Signature — evolução editorial (12/11/2026)
- Nova entrada editorial com composição gráfica original em CSS (órbitas, tipografia, gradientes e assinatura PULSE), em vez de imagens externas de origem ou licença incerta.
- A fotografia da utilizadora continua a vir exclusivamente do perfil INVICTAS quando disponível; caso contrário é apresentada a inicial.
- A composição é responsiva: hero em duas colunas no desktop e secções verticais no mobile.
- As ações mantêm navegação real para conversa, registo e evolução, com agenda e objetivos como percursos secundários.
- Identidade cromática reforçada em conversa, registo, evolução e planeamento; sem alteração dos dados de saúde, backend, consentimento ou armazenamento.
- Testes estáticos acrescentados para classes e layout. **Validação visual em navegador e testes reais continuam pendentes.**
- Não se afirma que esta versão está pronta para lançamento; a aceitação visual depende de revisão com utilizadoras e verificação em dispositivos reais.
