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
 assert.match(home,/tab==='Pulse'/);
 assert.match(home,/href="\/pulse\/prototipo"/);
 assert.match(home,/tab==='Pulse'&&<div className="inv-pulse-editorial">/);
 assert.match(home,/inv-interior-cover inv-cover-pulse/);
 assert.match(workspace,/export default function PulseWorkspace/);
 assert.match(workspace,/return <PulseAgent/);
 assert.match(prototype,/db\.auth\.getSession/);
 assert.match(prototype,/if\(!session\)/);
 assert.match(prototype,/<PulseWorkspace userId=\{session\.user\.id\}/);
 assert.doesNotMatch(prototype,/Simular registo|Exemplo ilustrativo|setChat/);
 assert.match(css,/\.pulse-preview-real/);
 assert.match(css,/\.pulse-preview-real \.pulse-agent \.pa-hero-art\{display:none\}/);
});

test('Ciclo é visível e opcional sem segundo desbloqueio',()=>{
 const pulse=readFileSync(new URL('../app/PulseAgent.tsx',import.meta.url),'utf8');
 const cycle=readFileSync(new URL('../app/CycleJournal.tsx',import.meta.url),'utf8');
 assert.match(pulse,/tab\('bemestar','Bem-estar'\)/);
 assert.match(pulse,/setView\('ciclo'\)/);
 assert.match(cycle,/Quero registar o meu ciclo/);
 assert.doesNotMatch(cycle,/type="password"/);
 assert.match(cycle,/invictas-cycle-vault-v1-/);
});

test('Pulse usa cabeçalho fotográfico e check-ins só com consentimento',()=>{
 const pulse=readFileSync(new URL('../app/PulseAgent.tsx',import.meta.url),'utf8');
 const css=readFileSync(new URL('../app/style.css',import.meta.url),'utf8');
 assert.match(css,/photo-1547347298-4074fc3086f0/);
 assert.match(css,/photo-1518611012118-696072aa579a/);
 assert.match(pulse,/if\(settings\.consent\)\{try\{const stored=JSON\.parse\(localStorage\.getItem\(phaseOneKey\)/);
 assert.match(pulse,/checkinContext/);
 assert.match(pulse,/não permitem conclusões clínicas/);
});

test('Resumo semanal orienta reflexão sem incluir dados do ciclo',()=>{
 const phase=readFileSync(new URL('../app/PulsePhaseOne.tsx',import.meta.url),'utf8');
 assert.match(phase,/Uma pergunta para a próxima semana/);
 assert.match(phase,/não inclui o ciclo/i);
 assert.match(phase,/Rever o meu planeamento/);
});

test('Registos de bem-estar opt-in e cofres anteriores preservados',()=>{
 const pulse=readFileSync(new URL('../app/PulseAgent.tsx',import.meta.url),'utf8');
 const wellness=readFileSync(new URL('../app/pulse/PulseWellbeing.tsx',import.meta.url),'utf8');
 const cycle=readFileSync(new URL('../app/CycleJournal.tsx',import.meta.url),'utf8');
 assert.match(wellness,/Quero registar os meus hábitos/);
 assert.match(wellness,/sem encriptação adicional/);
 assert.doesNotMatch(wellness,/type="password"/);
 assert.match(cycle,/cofre antigo cifrado/);
 assert.match(pulse,/localStorage\.removeItem\(wellbeingChoiceKey\)/);
 assert.match(pulse,/localStorage\.removeItem\(cycleChoiceKey\)/);
});

test('Pulse navega para Bem-estar e agenda diária semanal mensal',()=>{
 const pulse=readFileSync(new URL('../app/PulseAgent.tsx',import.meta.url),'utf8');
 const agenda=readFileSync(new URL('../app/pulse/PulseAgenda.tsx',import.meta.url),'utf8');
 const reminders=readFileSync(new URL('../app/pulse/PulseReminders.tsx',import.meta.url),'utf8');
 assert.match(pulse,/tab\('bemestar','Bem-estar'\)/);
 assert.match(pulse,/\['bemestar','♡','Bem-estar'\]/);
 assert.match(pulse,/<PulseAgenda userId=\{userId\} plans=\{plans\}/);
 assert.match(pulse,/Hidratação/);
 assert.match(pulse,/Nutrição/);
 assert.match(pulse,/Registo opcional · calendário pessoal/);
 assert.match(agenda,/\['semana','dia','mes'\]/);
 assert.match(agenda,/onRegister\(p\)/);
 assert.match(reminders,/não existem alertas automáticos|Não existem alertas automáticos/);
 assert.match(pulse,/localStorage\.removeItem\(remindersKey\)/);
});

test('Objetivos integram passos de atividade e bem-estar na agenda',()=>{
 const goals=readFileSync(new URL('../app/PulsePhaseTwo.tsx',import.meta.url),'utf8');
 const agenda=readFileSync(new URL('../app/pulse/PulseAgenda.tsx',import.meta.url),'utf8');
 assert.match(goals,/type GoalAction=/);
 assert.match(goals,/category:'atividade'\|'bemestar'/);
 assert.match(goals,/addAction\(g\)/);
 assert.match(goals,/toggleAction\(g,a\)/);
 assert.match(goals,/invictas-pulse-goals-changed/);
 assert.match(agenda,/const steps=goals\.flatMap/);
 assert.match(agenda,/Bem-estar: /);
 assert.match(agenda,/\.\.\.steps/);
});

test('Pulse apresenta avisos opcionais de agenda sem notificações push',()=>{
 const pulse=readFileSync(new URL('../app/PulseAgent.tsx',import.meta.url),'utf8');
 const home=readFileSync(new URL('../app/page.tsx',import.meta.url),'utf8');
 assert.match(pulse,/agendaAlertsEnabled/);
 assert.match(pulse,/saveAlertPrefs/);
 assert.match(pulse,/Não são notificações push/);
 assert.match(home,/O teu ritmo/);
 assert.match(home,/A tua força/);
 assert.match(home,/inv-pulse-editorial-chapters/);
 assert.match(home,/tab==='Pulse'/);
});
