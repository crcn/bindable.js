var Binding = require("./object/binding");

module.exports = {
  Object       : require("./object"),
  Collection   : require("./collection"),
  EventEmitter : require("./core/eventEmitter"),
  computed     : require("./utils/computed"),
  options      : require("./utils/options")
};

Binding.Collection = module.exports.Collection;

if (typeof window !== "undefined") {
  window.bindable = module.exports;
}
