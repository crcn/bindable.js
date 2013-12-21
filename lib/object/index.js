var dref            = require("./dref"),
EventEmitter        = require("../core/eventEmitter"),
Binding             = require("./binding"),
protoclass          = require("protoclass"),
deepPropertyWatcher = require("./deepPropertyWatcher");

function Bindable (context) {

  if (!context) {
    context = {};
  }

  this.context(context);
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

    if (data.__isBindable) {
      throw new Error("context cannot be a bindable object");
    }

    this.__context = data;
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

  get: function (property) {

    var t, isString, hasDot;

    // optimal
    if ((isString = ((t = typeof property) === "string")) && (hasDot = !~property.indexOf("."))) {
      return this.__context[property];
    }

    // avoid split if possible
    var chain = isString ? hasDot ? property.split(".") : [property] : property,
    currentValue = this._context;

    // go through all the properties
    for (var i = 0, n = chain.length; i < n; i++) {

      currentValue    = currentValue[chain[i]];

      if (!currentValue) return;

      // current value is a bindable item? grab the context
      if (currentValue.__isBindable) {  
        currentValue = currentValue.__context;
      }
    }

    return currentValue;
  },

  /**
   */

  setProperties: function (properties) {
    for (var property in properties) {
      this.set(property, properties[k]);
    }
  },

  /**
   */

  set: function (property, value) {

    var t, isString, hasDot, hasChanged;

    // optimal
    if ((isString = ((t = typeof property) === "string")) && (hasDot = !~property.indexOf("."))) {
      hasChanged = this.__context[property] !== value;
      if (hasChanged) this.__context[property] = value;
    } else {

      // avoid split if possible
      var chain = isString ? hasDot ? property.split(".") : [property] : property,
      currentValue = this.__context,
      previousValue = currentValue,
      currentProperty,
      newChain;

      for (var i = 0, n = chain.length - 1; i < n; i++) {

        currentProperty = chain[i];
        previousValue   = currentValue;
        currentValue    = currentValue[currentProperty];


        // is the previous value bindable? pass it on
        if (previousValue.__isBindable) {
          newChain = chain.slice(i);
          // check if the value has changed
          hasChanged = previousValue.get(newChain) !== value;
          previousValue.set(newChain, value);
          break;
        }

        if (!currentValue || (typeof currentValue !== "object")) {
          currentValue = previousValue[currentProperty] = {};
        }
      }

      if (!newChain && (hasChanged = (currentValue !== value))) {
        previousValue[currentProperty] = value;
      }
    }

    if (!hasChanged) return;

    this.emit("change:" + property, value);
    this.emit("change", property, value);
    return value;
  },

  /**
   */

  bind: function (property, fn, now) {
    return watchProperty(this, property, fn, now);
    /*
    if (typeof property === "object") {
      return Binding.fromOptions(this, property);
    }

    if (to && to.__isBinding) {
      this.set(property, to);
      return;
    }

    return new Binding(this, property).to(to);
    */
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
    return this.__context;
  }
});

module.exports                 = Bindable;
module.exports.EventEmitter    = EventEmitter;
module.exports.propertyWatcher = deepPropertyWatcher;
