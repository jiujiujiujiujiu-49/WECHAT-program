var storage = require('../../utils/storage');

var qualityOptions = ['好', '一般', '差'];

Page({
  data: {
    record: null,
    qualityOptions: qualityOptions,
    qualityIndex: 0
  },

  onLoad: function() {
    this.loadRecord();
  },

  loadRecord: function() {
    var record = storage.getTodayRecord();
    var qualityIndex = qualityOptions.indexOf(record.sleep.quality);

    this.setData({
      record: record,
      qualityIndex: qualityIndex >= 0 ? qualityIndex : 0
    });
  },

  updateField: function(event) {
    var path = event.currentTarget.dataset.path;
    this.setData({
      ['record.' + path]: event.detail.value
    });
  },

  updateNumber: function(event) {
    var path = event.currentTarget.dataset.path;
    var value = Number(event.detail.value);

    this.setData({
      ['record.' + path]: isNaN(value) ? 0 : value
    });
  },

  updateSwitch: function(event) {
    var path = event.currentTarget.dataset.path;

    this.setData({
      ['record.' + path]: event.detail.value
    });
  },

  updateQuality: function(event) {
    var index = Number(event.detail.value);

    this.setData({
      qualityIndex: index,
      'record.sleep.quality': qualityOptions[index]
    });
  },

  saveRecord: function() {
    storage.saveTodayRecord(this.data.record);

    wx.showToast({
      title: '已保存',
      icon: 'success'
    });
  }
});
