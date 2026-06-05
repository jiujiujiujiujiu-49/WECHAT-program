var recordUtils = require('./record');

var STORAGE_KEY = 'DAILY_RECORDS_V1';

function readRecordMap() {
  try {
    return wx.getStorageSync(STORAGE_KEY) || {};
  } catch (error) {
    return {};
  }
}

function writeRecordMap(recordMap) {
  wx.setStorageSync(STORAGE_KEY, recordMap || {});
}

function getRecordByDate(date) {
  var recordMap = readRecordMap();
  return recordUtils.mergeWithDefaultRecord(date, recordMap[date]);
}

function saveRecord(record) {
  var date = record.date;
  var recordMap = readRecordMap();
  recordMap[date] = recordUtils.mergeWithDefaultRecord(date, record);
  writeRecordMap(recordMap);
  return recordMap[date];
}

function getAllRecords() {
  var recordMap = readRecordMap();
  return Object.keys(recordMap)
    .sort()
    .reverse()
    .map(function(date) {
      return recordUtils.mergeWithDefaultRecord(date, recordMap[date]);
    });
}

module.exports = {
  STORAGE_KEY: STORAGE_KEY,
  getRecordByDate: getRecordByDate,
  saveRecord: saveRecord,
  getAllRecords: getAllRecords
};
