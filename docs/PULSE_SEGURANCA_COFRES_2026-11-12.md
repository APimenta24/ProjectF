# Pulse — segurança dos dados locais · 12/11/2026

## Implementado nesta branch
- Novos cofres separados para ciclo (`invictas-cycle-vault-v1-<userId>`) e hidratação/nutrição (`invictas-pulse-wellbeing-vault-v1-<userId>`).
- Cifra autenticada AES-256-GCM via Web Crypto; PBKDF2-SHA-256 com 310 000 iterações, salt aleatório 16 bytes, IV aleatório 12 bytes por gravação.
- Frase-passe com mínimo de 12 caracteres, nunca persistida; desbloqueio manual após reabrir o módulo.
- Migração de registos locais anteriores após criação de cofre. A cópia antiga é removida após gravação cifrada; uma falha pode exigir intervenção e a limpeza física não é garantida pelo navegador.
- Eliminação local do cofre; ciclo permanece separado da eliminação global do agente.
- Sem envio de conteúdo de ciclo/nutrição/hidratação ao agente nem à base de dados por estes componentes.

## Limites e riscos
- **O Pulse completo NÃO está cifrado**: treinos, conversas, objetivos, planos, check-ins e preferências continuam no armazenamento local legado. Não apresentar o produto como integralmente encriptado.
- A autenticação Supabase não é um substituto da frase-passe de cifragem.
- Cifra em repouso não impede leitura enquanto o cofre está desbloqueado nem protege contra XSS, extensões maliciosas, dispositivo comprometido, capturas de ecrã ou cópias antigas.
- O utilizador não consegue recuperar dados se perder a frase-passe; não existe sincronização entre dispositivos.
- A remoção por `localStorage.removeItem` não garante eliminação forense.
- Os backups JSON anteriores do ciclo deixam de estar disponíveis no novo ecrã. Antes de atualizar, confirmar o percurso de migração e recuperação com dados de teste.
- A política de privacidade continua em revisão: base legal, Artigo 9.º RGPD, DPIA, conservação, subcontratantes, direitos, menores e contacto real.
- O consentimento deve ser específico por finalidade e revogável; a migração não autoriza tratamento adicional.
- Testes estáticos não equivalem a testes E2E, nem auditoria criptográfica.

## Próximas condições para lançamento
1. E2E de criação, desbloqueio, frase-passe errada, migração legada, armazenamento bloqueado, eliminação e mudança de conta.
2. Cifrar ou retirar de armazenamento persistente os restantes dados sensíveis (check-ins, treino, chat, planos), com migração e exportação segura.
3. Rever XSS/CSP, terceiros e imagens remotas, sessão, controlo de acesso, consentimento e dados de menores.
4. Validar RGPD/DPIA e política de privacidade com responsável qualificado.
5. Revisão visual e acessibilidade em dispositivos reais.

Nenhuma alteração à base de dados Supabase nem à produção foi efetuada nesta implementação.
