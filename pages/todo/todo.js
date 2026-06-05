var dateUtils = require('../../utils/date');
var storage = require('../../utils/storage');
var validate = require('../../utils/validate');

Page({
  data: {
    today: '',
    record: null,
    newTodo: ''
  },

  onShow: function() {
    var today = dateUtils.formatDate();
    this.setData({
      today: today,
      record: storage.getRecordByDate(today),
      newTodo: ''
    });
  },

  updateNewTodo: function(event) {
    this.setData({
      newTodo: event.detail.value
    });
  },

  addTodo: function() {
    var text = validate.sanitizeText(this.data.newTodo, 60);
    if (!text) {
      wx.showToast({
        title: '请输入任务',
        icon: 'none'
      });
      return;
    }

    var record = this.data.record;
    record.todos.unshift({
      id: String(Date.now()),
      text: text,
      done: false
    });
    storage.saveRecord(record);

    this.setData({
      record: record,
      newTodo: ''
    });
  },

  toggleTodo: function(event) {
    var id = event.currentTarget.dataset.id;
    var record = this.data.record;
    record.todos = record.todos.map(function(todo) {
      if (todo.id === id) {
        return Object.assign({}, todo, { done: !todo.done });
      }
      return todo;
    });
    storage.saveRecord(record);
    this.setData({ record: record });
  },

  deleteTodo: function(event) {
    var id = event.currentTarget.dataset.id;
    var record = this.data.record;
    record.todos = record.todos.filter(function(todo) {
      return todo.id !== id;
    });
    storage.saveRecord(record);
    this.setData({ record: record });
  }
});
