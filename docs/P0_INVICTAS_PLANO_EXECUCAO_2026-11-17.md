# INVICTAS — P0 | Plano de execução e critérios de aceitação
Data: 2026-11-17
Âmbito: qualidade do produto principal INVICTAS. Pulse é uma ferramenta complementar.
Ambiente: branch audit/p0-invictas-quality criada a partir de feat/pulse-on-current-invictas. Não alterar main nem promover deployments.

## Estado observado
- main e branch de desenvolvimento divergentes (414 commits ahead na comparação de 17/11).
- Vercel: último deployment de produção READY; previews da branch READY e alguns ERROR. READY não comprova fluxos funcionais.
- app/page.tsx concentra autenticação, navegação, comunidade, perfil, oportunidades e administração; refatorização deve ser incremental.
- Existem testes estáticos e workflows, mas a validação E2E, RLS, privacidade e acessibilidade permanece por comprovar.
- A versão de trabalho da política de privacidade não é suficiente para abertura pública.

## Ordem de execução (sem criar funcionalidades)
### P0.1 — Congelar âmbito e mapear percursos
- Inventariar ecrãs e estados: anónimo, membro, admin, vazio, erro, loading e telemóvel.
- Percursos: descobrir valor -> registar -> completar perfil -> encontrar oportunidade -> participar -> regressar.
- Medir passos, fricções e mensagens de erro; recolher capturas de preview.
Aceitação: mapa de percursos e matriz de problemas com gravidade, evidência e responsável.

### P0.2 — Estabilizar qualidade técnica
- Verificar workflows de CI no ramo efetivamente usado; testes, TypeScript, build e lockfile.
- Extrair gradualmente componentes do app/page.tsx sem alterar comportamento nem modelos de dados.
- Confirmar tratamento de estados vazios, erros e sincronização por conta.
Aceitação: npm test, npx tsc --noEmit, npm run build aprovados num commit identificado; ausência de regressões.

### P0.3 — Segurança, privacidade e permissões
- Validar RLS e Storage com contas anónima, membro e admin; testar escalada de privilégios.
- Testar consentimento, revogação, exportação e apagamento, com atenção especial aos dados de saúde do Pulse.
- Concluir informação legal, retenção, subcontratantes, direitos de imagem e contacto de privacidade.
Aceitação: evidência dos testes e revisão legal/operacional; nenhum bloqueador crítico aberto.

### P0.4 — UX e acessibilidade
- Testar em mobile, teclado, contraste, formulários, estados de carregamento e leitor de ecrã.
- Reduzir a fricção no registo, personalização, participação e oportunidades.
- Reforçar hierarquia: INVICTAS primeiro; Pulse como ferramenta.
Aceitação: tarefas essenciais concluídas sem assistência por utilizadoras de teste; defeitos críticos resolvidos.

### P0.5 — Piloto controlado e decisão GO/NO-GO
- Convidar um grupo pequeno de mulheres com perfis desportivos diferentes, sem métricas fictícias.
- Recolher conclusão de tarefas, problemas, valor percebido e intenção de regresso.
- Rever conteúdos, oportunidades reais e consentimentos editoriais.
Aceitação: relatório de resultados, lista priorizada de correções e decisão expressa antes de produção.

## Regras
1. Não promover para produção nem fazer merge para main sem autorização.
2. Não adicionar funcionalidades durante P0; corrigir percursos e qualidade.
3. Cada problema deve incluir: reprodução, impacto, gravidade, solução proposta e prova de correção.
4. Não tratar deployment READY, testes estáticos ou documentação como prova de segurança ou de usabilidade.
5. Não usar dados pessoais reais nos testes.
