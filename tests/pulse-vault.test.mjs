import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {webcrypto} from 'node:crypto';
import ts from 'typescript';

const source=readFileSync(new URL('../app/pulse/secureVault.ts',import.meta.url),'utf8');
const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
const {encryptVault,decryptVault,isVault}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
Object.defineProperty(globalThis,'crypto',{configurable:true,value:webcrypto});

test('cofre cifra e recupera dados sem persistir frase-passe',async()=>{
 const original=[{day:'2026-11-12',note:'privado'}];
 const pass='frase-passe-com-mais-de-12';
 const encrypted=await encryptVault(original,pass);
 assert.equal(isVault(encrypted),true);
 assert.deepEqual(await decryptVault(encrypted,pass),original);
 assert.equal(JSON.stringify(encrypted).includes('privado'),false);
 assert.equal(JSON.stringify(encrypted).includes(pass),false);
});
test('cifra com IV novo em cada gravação',async()=>{
 const pass='frase-passe-com-mais-de-12';
 const first=await encryptVault({a:1},pass);
 const second=await encryptVault({a:1},pass,first.salt);
 assert.notEqual(first.iv,second.iv);
 assert.notEqual(first.data,second.data);
});
test('frase-passe errada e conteúdo adulterado não desbloqueiam',async()=>{
 const vault=await encryptVault({a:1},'frase-passe-com-mais-de-12');
 await assert.rejects(decryptVault(vault,'frase-passe-errada-123'));
 const altered={...vault,data:Buffer.from('conteudo adulterado').toString('base64')};
 await assert.rejects(decryptVault(altered,'frase-passe-com-mais-de-12'));
});
test('rejeita frases-passe curtas',async()=>{
 await assert.rejects(encryptVault({a:1},'curta'));
});
