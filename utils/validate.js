function sanitizeNumber(value, fallback) {
  var number = Number(value);
  if (!isFinite(number) || number < 0) {
    return fallback;
  }
  return Math.round(number * 10) / 10;
}

function sanitizeInteger(value, fallback) {
  return Math.round(sanitizeNumber(value, fallback));
}

function sanitizeText(value, maxLength) {
  var text = value == null ? '' : String(value).trim();
  if (maxLength && text.length > maxLength) {
    return text.slice(0, maxLength);
  }
  return text;
}

module.exports = {
  sanitizeNumber: sanitizeNumber,
  sanitizeInteger: sanitizeInteger,
  sanitizeText: sanitizeText
};
