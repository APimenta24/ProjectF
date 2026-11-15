import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const sql=readFileSync(new URL('../supabase/pulse_staging_schema.sql',import.meta.url),'utf8');
const plan=readFileSync(new URL('../docs/pulse-account-storage-plan.md',import.meta.url),'utf8');

test('Pulse staging schema keeps data bound to auth user and enforces ownership on every operation',()=>{
 assert.match(sql,/references auth\.users\(id\) on delete cascade/g);
 assert.match(sql,/primary key \(user_id,area\)/);
 for(const table of ['pulse_documents','pulse_consents']){
  assert.match(sql,new RegExp('alter table public\\.'+table+' enable row level security'));
  for(const op of ['select','insert','update','delete']){
   assert.match(sql,new RegExp('create policy '+table+'_owner_'+op+' on public\\.'+table));
  }
 }
 assert.match(sql,/using \(\(select auth\.uid\(\)\)=user_id\) with check \(\(select auth\.uid\(\)\)=user_id\)/);
 assert.doesNotMatch(sql,/security definer/i);
 assert.doesNotMatch(sql,/service_role/i);
});

test('Pulse staging schema separates cycle consent and documents explicit limits',()=>{
 for(const area of ['agent','checkins','goals','agenda_alerts','reminders','wellbeing','cycle']){
  assert.ok(sql.includes("'"+area+"'"),area);
 }
 for(const purpose of ['pulse_storage','wellbeing_storage','cycle_storage','cycle_agent_access']){
  assert.ok(sql.includes("'"+purpose+"'"),purpose);
 }
 assert.match(plan,/não impõe por si só consentimentos/i);
 assert.match(plan,/não incluir no contexto do agente por defeito/i);
 assert.match(plan,/contas A e B/i);
 assert.match(plan,/produção inalterada/i);
});
