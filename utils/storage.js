function pad(value) {
  return value < 10 ? '0' + value : '' + value;
}

function getTodayDate() {
  var now = new Date();
  return now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
}

function getStorageKey(date) {
  return 'daily-record-' + date;
}

function createDefaultRecord(date) {
  return {
    date: date,
    water: { amount: 0, target: 2000 },
    workout: { checked: false, type: '', duration: 0 },
    study: { checked: false, content: '', duration: 0 },
    meals: { breakfast: '', lunch: '', dinner: '', snack: '' },
    sleep: { hours: 0, quality: '' },
    todos: []
  };
}

function mergeWithDefaultRecord(date, record) {
  var defaults = createDefaultRecord(date);
  var source = record || {};

  return {
    date: date,
    water: Object.assign({}, defaults.water, source.water || {}),
    workout: Object.assign({}, defaults.workout, source.workout || {}),
    study: Object.assign({}, defaults.study, source.study || {}),
    meals: Object.assign({}, defaults.meals, source.meals || {}),
    sleep: Object.assign({}, defaults.sleep, source.sleep || {}),
    todos: Array.isArray(source.todos) ? source.todos : []
  };
}

function getRecordByDate(date) {
  var key = getStorageKey(date);
  var savedRecord = wx.getStorageSync(key);

  if (!savedRecord) {
    var defaultRecord = createDefaultRecord(date);
    wx.setStorageSync(key, defaultRecord);
    return defaultRecord;
  }

  return mergeWithDefaultRecord(date, savedRecord);
}

function saveRecordByDate(date, record) {
  var nextRecord = mergeWithDefaultRecord(date, record);
  wx.setStorageSync(getStorageKey(date), nextRecord);
  return nextRecord;
}

function getTodayRecord() {
  return getRecordByDate(getTodayDate());
}

function saveTodayRecord(record) {
  return saveRecordByDate(getTodayDate(), record);
}

function getAllRecords() {
  var info = wx.getStorageInfoSync();
  var keys = Array.isArray(info.keys) ? info.keys : [];

  return keys
    .filter(function(key) {
      return key.indexOf('daily-record-') === 0;
    })
    .map(function(key) {
      return key.replace('daily-record-', '');
    })
    .sort()
    .reverse()
    .map(function(date) {
      return getRecordByDate(date);
    });
}

module.exports = {
  getTodayDate: getTodayDate,
  getRecordByDate: getRecordByDate,
  saveRecordByDate: saveRecordByDate,
  getTodayRecord: getTodayRecord,
  saveTodayRecord: saveTodayRecord,
  createDefaultRecord: createDefaultRecord,
  getAllRecords: getAllRecords
};
