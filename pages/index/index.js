var dateUtils = require('../../utils/date');
var storage = require('../../utils/storage');

Page({
  data: {
    today: '',
    record: null,
    waterPercent: 0,
    todoSummary: '0 / 0'
  },

  onShow: function() {
    this.loadToday();
  },

  loadToday: function() {
    var today = dateUtils.formatDate();
    var record = storage.getRecordByDate(today);
    var doneCount = record.todos.filter(function(todo) {
      return todo.done;
    }).length;
    var waterPercent = record.water.target > 0
      ? Math.min(100, Math.round((record.water.amount / record.water.target) * 100))
      : 0;

    this.setData({
      today: today,
      record: record,
      waterPercent: waterPercent,
      todoSummary: doneCount + ' / ' + record.todos.length
    });
  },

  goRecord: function() {
    wx.switchTab({ url: '/pages/record/record' });
  },

  goTodo: function() {
    wx.switchTab({ url: '/pages/todo/todo' });
  },

  goHistory: function() {
    wx.switchTab({ url: '/pages/history/history' });
  }
});
