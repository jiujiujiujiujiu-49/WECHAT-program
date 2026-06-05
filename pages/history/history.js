var storage = require('../../utils/storage');

Page({
  data: {
    records: [],
    dateOptions: [],
    selectedIndex: 0,
    selectedRecord: null,
    waterPercent: 0,
    todoSummary: '0 / 0'
  },

  onShow: function() {
    this.loadRecords();
  },

  loadRecords: function() {
    var records = storage.getAllRecords();
    var selectedIndex = records.length ? Math.min(this.data.selectedIndex, records.length - 1) : 0;
    var selectedRecord = records[selectedIndex] || null;
    this.setData({
      records: records,
      dateOptions: records.map(function(record) {
        return record.date;
      }),
      selectedIndex: selectedIndex,
      selectedRecord: selectedRecord
    });
    this.updateSummary(selectedRecord);
  },

  changeDate: function(event) {
    var selectedIndex = Number(event.detail.value);
    var selectedRecord = this.data.records[selectedIndex] || null;
    this.setData({
      selectedIndex: selectedIndex,
      selectedRecord: selectedRecord
    });
    this.updateSummary(selectedRecord);
  },

  updateSummary: function(record) {
    if (!record) {
      this.setData({
        waterPercent: 0,
        todoSummary: '0 / 0'
      });
      return;
    }

    var doneCount = record.todos.filter(function(todo) {
      return todo.done;
    }).length;
    var waterPercent = record.water.target > 0
      ? Math.min(100, Math.round((record.water.amount / record.water.target) * 100))
      : 0;

    this.setData({
      waterPercent: waterPercent,
      todoSummary: doneCount + ' / ' + record.todos.length
    });
  }
});
