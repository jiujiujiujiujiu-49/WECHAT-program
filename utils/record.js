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
    date: source.date || defaults.date,
    water: Object.assign({}, defaults.water, source.water || {}),
    workout: Object.assign({}, defaults.workout, source.workout || {}),
    study: Object.assign({}, defaults.study, source.study || {}),
    meals: Object.assign({}, defaults.meals, source.meals || {}),
    sleep: Object.assign({}, defaults.sleep, source.sleep || {}),
    todos: Array.isArray(source.todos) ? source.todos : []
  };
}

module.exports = {
  createDefaultRecord: createDefaultRecord,
  mergeWithDefaultRecord: mergeWithDefaultRecord
};
