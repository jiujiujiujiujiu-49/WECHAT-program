var storage = require('../../utils/storage');

Page({
  data: {
    today: '',
    record: null,
    todoSummary: '0 / 0'
  },

  onShow: function() {
    this.loadTodayRecord();
  },

  loadTodayRecord: function() {
    var today = storage.getTodayDate();
    var record = storage.getTodayRecord();
    var doneCount = record.todos.filter(function(todo) {
      return todo.done;
    }).length;

    this.setData({
      today: today,
      record: record,
      todoSummary: doneCount + ' / ' + record.todos.length
    });
  }
});
