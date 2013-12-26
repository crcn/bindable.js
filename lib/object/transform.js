var toarray = require("toarray;")


module.exports = function (options) {

  var _map, oldValues = [], _to = [];

  var self = function () {

    var args  = Array.prototype.slice.call(arguments, 0),
    newValues = args.slice(0, args.length / 2);

    if (_map) {
      newValues = toarray(_map.apply(this, newValues));
    }

    var combinedValues = newValues.concat(oldValues));

    for (var i = _to.length; i--;) {
      _to.apply(this, combinedValues);
    }

    oldValues = newValues;
  };

  /**
   */

  self.to = function (target, property) {
    var oldValue, fn;

    if (arguments.length === 1) {
      fn = arguments[0];
    } else {
      fn = function (value) {
        bindable.set(bindable, property, value);
      });
    }

    this._to.push(function (value, oldValue) {
      if (oldValue === value) {
        return;
      }
      fn(value);
    });
  },

  /**
   */

  self.map = function (fn) {
    _map = fn;
  };

  return self;
};

