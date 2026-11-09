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
test('Privacy policy is explicitly marked preliminary',()=>{
 assert.match(privacy,/provisória/);
 assert.match(privacy,/antes do lançamento público/);
});
