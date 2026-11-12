import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const page=readFileSync(new URL('../app/page.tsx',import.meta.url),'utf8');
const cms=readFileSync(new URL('../app/EditorialManager.tsx',import.meta.url),'utf8');
const privacy=readFileSync(new URL('../app/privacidade/page.tsx',import.meta.url),'utf8');
test('Community submissions are pending and require consent',()=>{
 assert.match(page,/if\(!publicationConsent\)/);
 assert.match(page,/status:'pending'/);
});
test('Admin article approval requires an explicit editorial review check',()=>{
 assert.match(page,/if\(!reviewChecks\[id\]\)/);
 assert.match(page,/approve_editorial_submission/);
 assert.match(page,/Confirmei autoria, consentimento/);
});
test('Opportunity approval requires checking organiser and URL',()=>{
 assert.match(page,/Confirmei entidade organizadora, URL oficial/);
 assert.match(page,/publish_opportunity_submission/);
});
test('Moderation records reasons and uses private member notifications',()=>{
 assert.match(page,/moderation_reason:reason/);
 assert.match(page,/member_notifications/);
});
test('Admin user management uses server function, not service key in browser',()=>{
 assert.match(page,/functions\.invoke\('invictas-admin-users'/);
 assert.doesNotMatch(page,/SERVICE_ROLE_KEY/);
});
test('Editorial deletion archives instead of permanently deleting',()=>{
 assert.match(cms,/archived:true/);
 assert.match(cms,/moderation_reason/);
});
test('Privacy policy documents scope and unresolved pre-launch obligations',()=>{
 assert.match(privacy,/Versão de trabalho/);
 assert.match(privacy,/antes do lançamento público/);
 assert.match(privacy,/Supabase/);
 assert.match(privacy,/Vercel/);
 assert.match(privacy,/artigo 9.º/);
 assert.match(privacy,/CNPD/);
});

test('Analytics exige consentimento e usa apenas funções com prova de posse',()=>{
 assert.match(page,/localStorage\.getItem\('invictas-analytics-consent'\)!=='yes'/);
 assert.match(page,/db\.rpc\('track_site_event_verified'/);
 assert.match(page,/db\.rpc\('erase_visitor_events_verified'/);
 assert.doesNotMatch(page,/db\.rpc\('track_site_event'/);
 assert.doesNotMatch(page,/db\.rpc\('erase_visitor_events'/);
});
test('Pulse usa chave local por utilizadora e exige consentimento',()=>{
 const pulse=readFileSync(new URL('../app/PulseAgent.tsx',import.meta.url),'utf8');
 assert.match(pulse,/invictas-pulse-agent-v2-'\+userId/);
 assert.match(pulse,/if\(data\?\.settings\?\.consent===true\)/);
 assert.match(pulse,/if\(s\.consent\)localStorage\.setItem\(KEY/);
});
test('SQL preparado revoga EXECUTE das funções legadas a PUBLIC',()=>{
 const sql=readFileSync(new URL('../docs/P0_ANALYTICS_RPC_RESTRICAO_PROPOSTA.sql',import.meta.url),'utf8');
 assert.match(sql,/REVOKE EXECUTE ON FUNCTION public\.erase_visitor_events\(uuid\) FROM PUBLIC, anon, authenticated/);
 assert.match(sql,/REVOKE EXECUTE ON FUNCTION public\.track_site_event\(text, text, uuid, text\) FROM PUBLIC, anon, authenticated/);
});

test('Pulse integra a hierarquia visual com ações funcionais',()=>{
 const pulse=readFileSync(new URL('../app/PulseAgent.tsx',import.meta.url),'utf8');
 const css=readFileSync(new URL('../app/style.css',import.meta.url),'utf8');
 for(const label of ['Falar com o Pulse','Registar uma atividade','Ver a minha evolução','Organizar a agenda','Os meus objetivos'])assert.match(pulse,new RegExp(label));
 assert.match(pulse,/pa-actions-primary/);
 assert.match(css,/\.pa-actions-primary/);
 assert.match(css,/prefers-reduced-motion:reduce/);
});
test('Fases Pulse não restauram dados locais sem consentimento',()=>{
 for(const file of ['PulsePhaseOne.tsx','PulsePhaseTwo.tsx']){
  const source=readFileSync(new URL('../app/'+file,import.meta.url),'utf8');
  assert.match(source,/if\(!consent\)\{/);
  assert.match(source,/\[userId,consent\]/);
 }
});

test('Pulse mantém percursos completos e estilos ligados às funcionalidades',()=>{
 const pulse=readFileSync(new URL('../app/PulseAgent.tsx',import.meta.url),'utf8');
 const css=readFileSync(new URL('../app/style.css',import.meta.url),'utf8');
 for(const cls of ['pa-workspace-chat','pa-workspace-register','pa-workspace-progress','pa-workspace-plan','pa-view-intro','pa-register-form']){
  assert.match(pulse,new RegExp(cls));
  assert.match(css,new RegExp(cls));
 }
 assert.match(pulse,/setView\('registo'\)/);
 assert.match(pulse,/setView\('evolucao'\)/);
 assert.match(pulse,/Não foi possível confirmar o apagamento/);
});

test('Pulse Signature mantém arte original local e ligação ao percurso funcional',()=>{
 const pulse=readFileSync(new URL('../app/PulseAgent.tsx',import.meta.url),'utf8');
 const css=readFileSync(new URL('../app/style.css',import.meta.url),'utf8');
 for(const cls of ['pa-hero-editorial','pa-hero-art','pa-hero-content','pa-editorial-divider'])assert.match(pulse,new RegExp(cls));
 for(const cls of ['pa-hero-editorial','pa-hero-art-word','pa-hero-orbit','pa-editorial-divider'])assert.match(css,new RegExp(cls));
 assert.match(css,/@media\(max-width:700px\)/);
 assert.match(pulse,/onNavigate\?\.\('Perfil'\)/);
});

test('Pulse Fase 1 usa fronteira e preview funcional protegido por sessão',()=>{
 const workspace=readFileSync(new URL('../app/pulse/PulseWorkspace.tsx',import.meta.url),'utf8');
 const home=readFileSync(new URL('../app/page.tsx',import.meta.url),'utf8');
 const prototype=readFileSync(new URL('../app/pulse/prototipo/page.tsx',import.meta.url),'utf8');
 const css=readFileSync(new URL('../app/style.css',import.meta.url),'utf8');
 assert.match(home,/import Pulse from '\.\/pulse\/PulseWorkspace'/);
 assert.match(workspace,/export default function PulseWorkspace/);
 assert.match(workspace,/return <PulseAgent/);
 assert.match(prototype,/db\.auth\.getSession/);
 assert.match(prototype,/if\(!session\)/);
 assert.match(prototype,/<PulseWorkspace userId=\{session\.user\.id\}/);
 assert.doesNotMatch(prototype,/Simular registo|Exemplo ilustrativo|setChat/);
 assert.match(css,/\.pulse-preview-real/);
 assert.match(css,/\.pulse-preview-real \.pulse-agent \.pa-hero-art\{display:none\}/);
});
