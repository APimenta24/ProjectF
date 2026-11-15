import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const page = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');
const pulse = readFileSync(new URL('../app/PulseAgent.tsx', import.meta.url), 'utf8');

test('Analytics deletion only invokes the proof-verified RPC', () => {
  assert.match(page, /db\.rpc\('erase_visitor_events_verified'/);
  assert.doesNotMatch(page, /db\.rpc\('erase_visitor_events'/);
  assert.match(page, /if\(!secret\)\{setMessage\('A recolha de estatísticas foi desativada/);
});

test('Analytics tracking only invokes the proof-verified RPC after consent', () => {
  assert.match(page, /localStorage\.getItem\('invictas-analytics-consent'\)!=='yes'/);
  assert.match(page, /db\.rpc\('track_site_event_verified'/);
  assert.doesNotMatch(page, /db\.rpc\('track_site_event'/);
});

test('Pulse local data is keyed to the signed-in user and gated by consent', () => {
  assert.match(pulse, /invictas-pulse-agent-v2-'\+userId/);
  assert.match(pulse, /if\(data\?\.settings\?\.consent===true\)/);
  assert.match(pulse, /if\(s\.consent\)localStorage\.setItem\(KEY/);
});
