const assert = require('assert');

const { createDefaultRecord, mergeWithDefaultRecord } = require('../utils/record');
const { sanitizeNumber, sanitizeText } = require('../utils/validate');
const storage = require('../utils/storage');

function setByPath(target, path, value) {
  const parts = path.split('.');
  let cursor = target;
  for (let index = 0; index < parts.length - 1; index += 1) {
    cursor = cursor[parts[index]];
  }
  cursor[parts[parts.length - 1]] = value;
}

function run() {
  const storageData = {};
  let toastTitle = '';
  global.wx = {
    getStorageSync: (key) => storageData[key],
    setStorageSync: (key, value) => {
      storageData[key] = value;
    },
    getStorageInfoSync: () => ({
      keys: Object.keys(storageData)
    }),
    showToast: (options) => {
      toastTitle = options.title;
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

  let todayPage = null;
  global.Page = (config) => {
    todayPage = config;
  };
  delete require.cache[require.resolve('../pages/today/today')];
  require('../pages/today/today');

  todayPage.data = JSON.parse(JSON.stringify(todayPage.data));
  todayPage.setData = (updates) => {
    Object.keys(updates).forEach((path) => setByPath(todayPage.data, path, updates[path]));
  };

  todayPage.onLoad();
  assert.strictEqual(todayPage.data.record.date, todayDate);

  todayPage.updateNumber({ currentTarget: { dataset: { path: 'water.amount' } }, detail: { value: '1200' } });
  todayPage.updateSwitch({ currentTarget: { dataset: { path: 'workout.checked' } }, detail: { value: true } });
  todayPage.updateField({ currentTarget: { dataset: { path: 'meals.breakfast' } }, detail: { value: '鸡蛋和牛奶' } });
  todayPage.updateQuality({ detail: { value: 1 } });

  assert.strictEqual(todayPage.data.record.water.amount, 1200);
  assert.strictEqual(typeof todayPage.data.record.water.amount, 'number');
  assert.strictEqual(todayPage.data.record.workout.checked, true);
  assert.strictEqual(todayPage.data.record.meals.breakfast, '鸡蛋和牛奶');
  assert.strictEqual(todayPage.data.record.sleep.quality, '一般');

  todayPage.saveRecord();
  assert.strictEqual(toastTitle, '已保存');
  assert.strictEqual(storageData['daily-record-' + todayDate].water.amount, 1200);

  let todoPage = null;
  global.Page = (config) => {
    todoPage = config;
  };
  delete require.cache[require.resolve('../pages/todo/todo')];
  require('../pages/todo/todo');

  todoPage.data = JSON.parse(JSON.stringify(todoPage.data));
  todoPage.setData = (updates) => {
    Object.keys(updates).forEach((path) => setByPath(todoPage.data, path, updates[path]));
  };

  todoPage.onLoad();
  assert.strictEqual(todoPage.data.totalCount, 2);
  assert.strictEqual(todoPage.data.doneCount, 1);
  assert.strictEqual(todoPage.data.progressText, '1 / 2');

  todoPage.updateNewTodo({ detail: { value: '  写周计划  ' } });
  todoPage.addTodo();
  assert.strictEqual(todoPage.data.record.todos.length, 3);
  assert.strictEqual(todoPage.data.record.todos[0].text, '写周计划');
  assert.strictEqual(todoPage.data.record.todos[0].done, false);
  assert.strictEqual(storageData['daily-record-' + todayDate].todos.length, 3);

  const todoId = todoPage.data.record.todos[0].id;
  todoPage.toggleTodo({ currentTarget: { dataset: { id: todoId } } });
  assert.strictEqual(todoPage.data.record.todos[0].done, true);
  assert.strictEqual(todoPage.data.doneCount, 2);
  assert.strictEqual(todoPage.data.progressText, '2 / 3');

  todoPage.deleteTodo({ currentTarget: { dataset: { id: todoId } } });
  assert.strictEqual(todoPage.data.record.todos.length, 2);
  assert.strictEqual(storageData['daily-record-' + todayDate].todos.length, 2);

  storageData['daily-record-2026-06-03'] = storage.createDefaultRecord('2026-06-03');
  storageData['daily-record-2026-06-04'] = storage.saveRecordByDate('2026-06-04', {
    water: { amount: 1500 },
    workout: { checked: true, type: '跑步', duration: 30 },
    study: { checked: true, content: '英语', duration: 45 },
    meals: { breakfast: '粥', lunch: '面', dinner: '饭', snack: '水果' },
    sleep: { hours: 7, quality: '好' },
    todos: [
      { id: 'a', text: '读书', done: true },
      { id: 'b', text: '运动', done: false }
    ]
  });
  storageData['other-key'] = { ignored: true };

  const allRecords = storage.getAllRecords();
  assert.strictEqual(allRecords[0].date >= allRecords[1].date, true);
  assert.strictEqual(allRecords.some((record) => record.date === undefined), false);
  assert.strictEqual(allRecords.find((record) => record.date === '2026-06-04').water.amount, 1500);

  let historyPage = null;
  global.Page = (config) => {
    historyPage = config;
  };
  delete require.cache[require.resolve('../pages/history/history')];
  require('../pages/history/history');

  historyPage.data = JSON.parse(JSON.stringify(historyPage.data));
  historyPage.setData = (updates) => {
    Object.keys(updates).forEach((path) => setByPath(historyPage.data, path, updates[path]));
  };

  historyPage.onLoad();
  assert.strictEqual(historyPage.data.records[0].date, todayDate);
  assert.strictEqual(historyPage.data.records[1].date, '2026-06-04');
  assert.strictEqual(historyPage.data.records[1].todoSummary, '1 / 2');
  assert.strictEqual(historyPage.data.records[1].expanded, false);

  historyPage.toggleRecord({ currentTarget: { dataset: { date: '2026-06-04' } } });
  assert.strictEqual(historyPage.data.records[1].expanded, true);
}

run();
console.log('unit tests passed');
