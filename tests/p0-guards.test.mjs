import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const page=readFileSync(new URL('../app/page.tsx',import.meta.url),'utf8');
const editor=readFileSync(new URL('../app/EditorialManager.tsx',import.meta.url),'utf8');
const policy=readFileSync(new URL('../docs/NORMA_EDITORIAL_LANCAMENTO.md',import.meta.url),'utf8');
test('aprovação de artigos confirma revisão editorial no servidor',()=>{
 assert.match(page,/approve_editorial_submission'.*p_review_confirmed:true/s);
 assert.match(page,/if\(!reviewChecks\[id\]\)/);
});
test('proposta de artigo exige autorização explícita',()=>{
 assert.match(page,/if\(!editorialConsent\)/);
 assert.match(page,/consent_confirmed:true/);
});
test('rejeições exigem motivo e há notificações privadas',()=>{
 assert.match(page,/reason\.length<10/);
 assert.match(page,/member_notifications/);
});
test('gestão de contas exige confirmação antes de eliminar',()=>{
 assert.match(page,/adminUserDeleteConfirm!==target\.email/);
 assert.match(page,/confirmText:'ELIMINAR'/);
});
test('editorial exige fontes e licença fotográfica antes de publicar',()=>{
 assert.match(editor,/edit\.published/);
 assert.match(editor,/references_notes/);
 assert.match(editor,/image_rights_confirmed/);
 assert.match(editor,/image_credit/);
});
test('norma editorial proíbe autorizações e fontes inventadas',()=>{
 assert.match(policy,/Não publicar referências inventadas/i);
 assert.match(policy,/autorização explícita/i);
});
