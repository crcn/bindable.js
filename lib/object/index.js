var dref            = require("./dref"),
EventEmitter        = require("../core/eventEmitter"),
Binding             = require("./binding"),
protoclass          = require("protoclass"),
deepPropertyWatcher = require("./deepPropertyWatcher");

function Bindable (context) {


  if (!context) {
    context = {};
  }


  this.__context = context;

  Bindable.parent.call(this);
  this.setMaxListeners(0);
}


protoclass(EventEmitter, Bindable, {

  /**
   */

  __isBindable: true,

  /**
   */

  context: function (data) {
    if (!arguments.length) return this.__context;
    this.__context = data;
  },

  /**
   * TODO - remove this
   */

  _watching: function (property) {
    this.emit("watching", property);
  },

  /**
   */

  get: function (key, flatten) {

    if (flatten == null) {
      flatten = false;
    }

    return dref.get(this, this.__context, key, flatten);
  },

  /** 
   */

  toObject: function (key) {
    return this.get(key, true);
  },

  /**
   */

  keys: function () {
    return Object.keys(this.toObject());
  },

  /**
   */

  has: function (key) {
    return this.get(key) != null;
  },

  /**
   */

  set: function (key, value) {

    if (arguments.length === 1) {

      if (key.__isBindable) {
        var keys = key.keys(), k;
        for (var i = 0, n = keys.length; i < n; i++) {
          this._set(k = keys[i], key.get(k));
        }
        return this;
      }

      for (var k in key) {
        this._set(k, key[k]);
      }

      return this;
    }

    return this._set(key, value);
  },

  /**
   */

  reset: function (newData) {
    if (!newData) newData = {};
    this.set(newData);

    for(var key in this.__context) {
      if (dref.get(this, newData, key) == null) {
        this.set(key, void 0);
      }
    }

    return this;
  },

  /**
   */

  _set: function (key, value) {
    if (!dref.set(this, key, value)) return value;
    this.emit("change:" + key, value);
    this.emit("change", key, value);
    return value;
  },

  /**
   */

  bind: function (property, to) {

    if (typeof property === "object") {
      return Binding.fromOptions(this, property);
    }

    if (to && to.__isBinding) {
      this.set(property, to);
      return;
    }

    return new Binding(this, property).to(to);
  },

  /**
   */

  dispose: function () {
    this.emit("dispose");
    this._events = {};
  },

  /**
   */

  toJSON: function () {
    return this.toObject();
  }
});

module.exports = Bindable;
module.exports.EventEmitter = EventEmitter;
module.exports.propertyWatcher = deepPropertyWatcher;
