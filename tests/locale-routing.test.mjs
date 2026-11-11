import {after, before, test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createServer} from 'node:net';

let child;
let origin;
let logs = '';
before(async () => {
  const socket = createServer();
  await new Promise(resolve => socket.listen(0, '127.0.0.1', resolve));
  const port = socket.address().port;
  await new Promise(resolve => socket.close(resolve));
  origin = `http://127.0.0.1:${port}`;
  child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(port)], {
    cwd: process.cwd(), windowsHide: true,
    env: {...process.env, NEXT_TELEMETRY_DISABLED: '1'}, stdio: ['ignore','pipe','pipe']
  });
  child.stdout.on('data', chunk => logs += chunk);
  child.stderr.on('data', chunk => logs += chunk);
  for (let attempt = 0; attempt < 150; attempt++) {
    if (child.exitCode !== null) throw new Error(logs);
    try { await fetch(origin, {redirect:'manual', signal:AbortSignal.timeout(2000)}); return; } catch {}
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  throw new Error(`Next.js did not become ready: ${logs}`);
});
after(async () => {
  if (child && child.exitCode === null) {
    child.kill();
    await new Promise(resolve => child.once('exit', resolve));
  }
});

for (const [name, language, cookie, expected] of [
  ['Arabic browser selects Arabic', 'ar-PS,ar;q=0.9,en;q=0.8', '', '/ar'],
  ['English browser selects English', 'en-US,en;q=0.9', '', '/en'],
  ['Unsupported browser language selects English', 'fr-FR,fr;q=0.9', '', '/en'],
  ['Saved language overrides browser language', 'en-US', 'NEXT_LOCALE=ar', '/ar']
]) {
  test(name, async () => {
    const response = await fetch(origin, {redirect:'manual',headers:{'accept-language':language, cookie}});
    assert.equal(response.status, 307);
    assert.equal(new URL(response.headers.get('location'), origin).pathname, expected);
  });
}
for (const [locale, direction, title] of [
  ['ar','rtl','مشاريع غزة'], ['en','ltr','Gaza Projects']
]) {
  test(`${locale} renders translated HTML and correct direction`, async () => {
    const response = await fetch(`${origin}/${locale}`, {headers:{cookie:`NEXT_LOCALE=${locale==='ar'?'en':'ar'}`}});
    assert.equal(response.status,200);
    const html=await response.text();
    assert.match(html,new RegExp(`<html[^>]*lang="${locale}"[^>]*dir="${direction}"`));
    assert.ok(html.includes(title));
  });
}
test('Language link retains query parameters and persists selection', async () => {
  const response=await fetch(`${origin}/ar?type=web&page=2`);
  const html=await response.text();
  assert.match(html,/href="\/en\?type=web&amp;page=2"/);
  const switchResponse=await fetch(`${origin}/en?type=web&page=2`, {
    redirect:'manual',headers:{cookie:'NEXT_LOCALE=ar','accept-language':'ar'}
  });
  assert.equal(switchResponse.status,200);
  assert.match(switchResponse.headers.get('set-cookie')||'',/NEXT_LOCALE=en/);
  assert.match(switchResponse.headers.get('set-cookie')||'',/Max-Age=31536000/i);
});
test('Unsupported locale returns 404', async () => {
  const response=await fetch(`${origin}/fr`, {redirect:'follow'});
  assert.equal(response.status,404);
});
