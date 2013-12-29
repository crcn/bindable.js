module.exports = require("./index");

if (typeof window !== "undefined") {
  window.bindable = module.exports;
}