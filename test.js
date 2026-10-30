const test = require('node:test');
const assert = require('node:assert');
const app = require('./server');

test('health and events API', async () => {
  const server = app.listen(0);
  const base = `http://localhost:${server.address().port}`;
  const h = await (await fetch(base + '/health')).json();
  assert.strictEqual(h.status, 'ok');
  const list = await (await fetch(base + '/api/events')).json();
  assert.ok(list.length >= 2);
  server.close();
});
