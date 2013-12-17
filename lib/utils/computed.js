var toarray = require("toarray");

module.exports = function (properties, fn) {
  properties = toarray(properties);
  fn.refs = properties;
  return fn;
};