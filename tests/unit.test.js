const assert = require('assert');

const { createDefaultRecord, mergeWithDefaultRecord } = require('../utils/record');
const { sanitizeNumber, sanitizeText } = require('../utils/validate');

function run() {
  const today = createDefaultRecord('2026-06-05');
  assert.strictEqual(today.date, '2026-06-05');
  assert.deepStrictEqual(today.water, { amount: 0, target: 2000 });
  assert.deepStrictEqual(today.workout, { checked: false, type: '', duration: 0 });
  assert.deepStrictEqual(today.study, { checked: false, content: '', duration: 0 });
  assert.deepStrictEqual(today.todos, []);

  const merged = mergeWithDefaultRecord('2026-06-05', {
    water: { amount: 500 },
    todos: [{ id: 'a', text: 'read', done: false }]
  });
  assert.strictEqual(merged.water.amount, 500);
  assert.strictEqual(merged.water.target, 2000);
  assert.strictEqual(merged.todos.length, 1);
  assert.strictEqual(merged.sleep.quality, '');

  assert.strictEqual(sanitizeNumber('42', 0), 42);
  assert.strictEqual(sanitizeNumber('-3', 0), 0);
  assert.strictEqual(sanitizeNumber('abc', 5), 5);
  assert.strictEqual(sanitizeText('  hello  ', 10), 'hello');
  assert.strictEqual(sanitizeText('abcdefghijkl', 5), 'abcde');
}

run();
console.log('unit tests passed');
