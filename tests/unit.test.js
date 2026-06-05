const assert = require('assert');

const { createDefaultRecord, mergeWithDefaultRecord } = require('../utils/record');
const { sanitizeNumber, sanitizeText } = require('../utils/validate');
const storage = require('../utils/storage');

function run() {
  const storageData = {};
  global.wx = {
    getStorageSync: (key) => storageData[key],
    setStorageSync: (key, value) => {
      storageData[key] = value;
    }
  };

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

  const emptyRecord = storage.getRecordByDate('2026-06-05');
  assert.deepStrictEqual(emptyRecord, today);
  assert.deepStrictEqual(storageData['daily-record-2026-06-05'], today);

  const updatedRecord = storage.saveRecordByDate('2026-06-05', {
    water: { amount: 800 },
    workout: { checked: true },
    todos: [
      { id: '1', text: 'drink water', done: true },
      { id: '2', text: 'study', done: false }
    ]
  });
  assert.strictEqual(updatedRecord.date, '2026-06-05');
  assert.strictEqual(updatedRecord.water.amount, 800);
  assert.strictEqual(updatedRecord.water.target, 2000);
  assert.strictEqual(updatedRecord.workout.checked, true);
  assert.strictEqual(storage.getRecordByDate('2026-06-05').todos.length, 2);

  const todayDate = storage.getTodayDate();
  assert.match(todayDate, /^\d{4}-\d{2}-\d{2}$/);
}

run();
console.log('unit tests passed');
