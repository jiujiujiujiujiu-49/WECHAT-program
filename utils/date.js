function pad(value) {
  return value < 10 ? '0' + value : '' + value;
}

function formatDate(date) {
  var target = date || new Date();
  return target.getFullYear() + '-' + pad(target.getMonth() + 1) + '-' + pad(target.getDate());
}

module.exports = {
  formatDate: formatDate
};
