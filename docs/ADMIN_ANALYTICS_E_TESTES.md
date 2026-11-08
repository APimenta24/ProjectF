# INVICTAS — configurar administração e validar lançamento

## Conta administradora
1. Registar uma conta normal na aplicação com o endereço de email que André Filipe Mendes Pimenta escolher exclusivamente para administração.
2. Confirmar o email e ativar MFA no fornecedor de autenticação quando suportado.
3. No Supabase SQL Editor, depois de aplicar `supabase/schema.sql`, verificar a conta (substituir o parâmetro pelo email real; não divulgar o email em código público):
```sql
select u.id,u.email,p.role
from auth.users u join public.profiles p on p.id=u.id
where lower(u.email)=lower('EMAIL_ADMIN_A_CONFIRMAR');
```
4. Só depois de confirmar a correspondência exata, promover manualmente:
```sql
update public.profiles
set role='admin'
where id=(select id from auth.users where lower(email)=lower('EMAIL_ADMIN_A_CONFIRMAR'));
```
5. Confirmar que apenas a conta pretendida ficou com role admin:
```sql
select u.email,p.role from public.profiles p
join auth.users u on u.id=p.id where p.role='admin';
```
6. Entrar novamente na aplicação e abrir Backoffice. Nunca expor service_role no browser nem criar uma página pública de promoção a admin.

## Analytics
- Aplicar `supabase/site_analytics.sql` no Supabase SQL Editor após `schema.sql`.
- As RPCs de resumos verificam `public.is_admin()`; testar como visitante anónimo, membro normal e admin.
- O acompanhamento de navegadores depende de consentimento explícito. Um UUID aleatório no browser é dado pseudónimo, não anónimo.
- Ativar expurgo automático de eventos após 90 dias, confirmar que corre realmente e testar revogação de consentimento com eliminação do histórico.
- Evitar métricas inventadas: contagens de eventos não são pessoas únicas; navegadores recorrentes são uma estimativa.
- Antes de ativar, definir a política de privacidade final e um contacto válido para direitos dos titulares.

## Matriz de testes de ponta a ponta
| Caso | Visitante | Membro | Admin |
|---|---|---|---|
| Ler artigos públicos | Sim | Sim | Sim |
| Ver oportunidades publicadas | Sim | Sim | Sim |
| Propor oportunidade | Não | Sim, fica pending | Sim, fica pending |
| Ver propostas pendentes de terceiros | Não | Não | Sim |
| Aprovar ou rejeitar proposta | Não | Não | Sim |
| Consultar analytics | Não | Não | Sim |
| Publicar história sem aprovação da protagonista | Não | Não | Não |
| Alterar o próprio role para admin | Não | Não | Não |

Executar cada caso num ambiente de testes com dados não pessoais, confirmar a resposta da API e a alteração na base de dados. Verificar também a recuperação de palavra-passe, sessão expirada, links inválidos, mobile, teclado e leitor de ecrã.

## Estado em 08-11-2026
- Deploy de preview READY e build Next.js concluído.
- Testes de integração Supabase e E2E **não executados** por ausência de ligação autorizada ao projeto e de sessão de navegador autenticada.
- A branch de desenvolvimento **não foi promovida a produção**.
- Faltam validação editorial, oportunidades verificadas, contacto de privacidade, política legal final e ensaio com utilizadoras.
