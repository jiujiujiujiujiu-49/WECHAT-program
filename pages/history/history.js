var storage = require('../../utils/storage');

Page({
  data: {
    emptyText: '暂无历史记录',
    records: []
  },

  onLoad: function() {
    this.loadRecords();
  },

  onShow: function() {
    this.loadRecords();
  },

  loadRecords: function() {
    var existingExpanded = {};
    this.data.records.forEach(function(record) {
      existingExpanded[record.date] = record.expanded;
    });

    var records = storage.getAllRecords().map(function(record) {
      var doneCount = record.todos.filter(function(todo) {
        return todo.done;
      }).length;

      return Object.assign({}, record, {
        doneCount: doneCount,
        todoSummary: doneCount + ' / ' + record.todos.length,
        expanded: !!existingExpanded[record.date]
      });
    });

    this.setData({
      records: records
    });
  },

  toggleRecord: function(event) {
    var date = event.currentTarget.dataset.date;
    var records = this.data.records.map(function(record) {
      if (record.date === date) {
        return Object.assign({}, record, {
          expanded: !record.expanded
        });
      }
      return record;
    });

    this.setData({
      records: records
    });
  }
});
