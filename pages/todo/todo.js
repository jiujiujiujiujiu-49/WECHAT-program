var storage = require('../../utils/storage');

Page({
  data: {
    record: null,
    newTodo: '',
    totalCount: 0,
    doneCount: 0,
    progressText: '0 / 0'
  },

  onLoad: function() {
    this.loadTodos();
  },

  onShow: function() {
    this.loadTodos();
  },

  loadTodos: function() {
    var record = storage.getTodayRecord();
    this.refreshState(record, this.data.newTodo);
  },

  refreshState: function(record, newTodo) {
    var totalCount = record.todos.length;
    var doneCount = record.todos.filter(function(todo) {
      return todo.done;
    }).length;

    this.setData({
      record: record,
      newTodo: newTodo,
      totalCount: totalCount,
      doneCount: doneCount,
      progressText: doneCount + ' / ' + totalCount
    });
  },

  saveRecord: function(record, newTodo) {
    storage.saveTodayRecord(record);
    this.refreshState(record, newTodo);
  },

  updateNewTodo: function(event) {
    this.setData({
      newTodo: event.detail.value
    });
  },

  addTodo: function() {
    var text = this.data.newTodo.trim();
    if (!text) {
      wx.showToast({
        title: '请输入任务内容',
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

    this.saveRecord(record, '');
  },

  toggleTodo: function(event) {
    var id = event.currentTarget.dataset.id;
    var record = this.data.record;

    record.todos = record.todos.map(function(todo) {
      if (todo.id === id) {
        return {
          id: todo.id,
          text: todo.text,
          done: !todo.done
        };
      }
      return todo;
    });

    this.saveRecord(record, this.data.newTodo);
  },

  deleteTodo: function(event) {
    var id = event.currentTarget.dataset.id;
    var record = this.data.record;

    record.todos = record.todos.filter(function(todo) {
      return todo.id !== id;
    });

    this.saveRecord(record, this.data.newTodo);
  }
});
