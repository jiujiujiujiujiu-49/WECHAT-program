var dateUtils = require('../../utils/date');
var storage = require('../../utils/storage');
var validate = require('../../utils/validate');

var qualityOptions = ['好', '一般', '差'];

Page({
  data: {
    today: '',
    record: null,
    qualityOptions: qualityOptions,
    qualityIndex: -1
  },

  onShow: function() {
    var today = dateUtils.formatDate();
    var record = storage.getRecordByDate(today);
    this.setData({
      today: today,
      record: record,
      qualityIndex: qualityOptions.indexOf(record.sleep.quality)
    });
  },

  updateField: function(event) {
    var path = event.currentTarget.dataset.path;
    var value = event.detail.value;
    this.setData({
      ['record.' + path]: value
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
    var record = this.data.record;
    var cleanRecord = {
      date: this.data.today,
      water: {
        amount: validate.sanitizeInteger(record.water.amount, 0),
        target: validate.sanitizeInteger(record.water.target, 2000)
      },
      workout: {
        checked: !!record.workout.checked,
        type: validate.sanitizeText(record.workout.type, 30),
        duration: validate.sanitizeInteger(record.workout.duration, 0)
      },
      study: {
        checked: !!record.study.checked,
        content: validate.sanitizeText(record.study.content, 80),
        duration: validate.sanitizeInteger(record.study.duration, 0)
      },
      meals: {
        breakfast: validate.sanitizeText(record.meals.breakfast, 120),
        lunch: validate.sanitizeText(record.meals.lunch, 120),
        dinner: validate.sanitizeText(record.meals.dinner, 120),
        snack: validate.sanitizeText(record.meals.snack, 120)
      },
      sleep: {
        hours: validate.sanitizeNumber(record.sleep.hours, 0),
        quality: qualityOptions.indexOf(record.sleep.quality) >= 0 ? record.sleep.quality : ''
      },
      todos: record.todos
    };

    if (cleanRecord.water.target <= 0) {
      cleanRecord.water.target = 2000;
    }

    storage.saveRecord(cleanRecord);
    this.setData({
      record: cleanRecord,
      qualityIndex: qualityOptions.indexOf(cleanRecord.sleep.quality)
    });

    wx.showToast({
      title: '已保存',
      icon: 'success'
    });
  }
});
