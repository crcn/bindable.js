var dref            = require("./dref"),
EventEmitter        = require("../core/eventEmitter"),
protoclass          = require("protoclass"),
watchProperty       = require("./watchProperty");

function Bindable (context) {

  if (context) {
    this.context(context);
  } else {
    this.__context = {};
  }

  Bindable.parent.call(this);
}

watchProperty.BindableObject = Bindable;

protoclass(EventEmitter, Bindable, {

  /**
   */

  __isBindable: true,

  /**
   */

  context: function (data) {
    if (!arguments.length) return this.__context;

    // only exception is 
    if (data.__isBindable && data !== this) {
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

    var isString, hasDot;

    // optimal
    if ((isString = (typeof property === "string")) && !(hasDot = ~property.indexOf("."))) {
      return this.__context[property];
    }

    // avoid split if possible
    var chain    = isString ? hasDot ? property.split(".") : [property] : property,
    ctx          = this.__context,
    currentValue = ctx,
    currentProperty;

    // go through all the properties
    for (var i = 0, n = chain.length - 1; i < n; i++) {

      currentValue    = currentValue[chain[i]];

      if (!currentValue) return;

      // current value is a bindable item? grab the context
      if (currentValue.__isBindable && currentValue !== ctx) {  
        currentValue = currentValue.__context;
      }
    }
    // might be a bindable object
    if(currentValue) return currentValue[chain[i]];
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

    var isString, hasDot, hasChanged, oldValue;

    // optimal
    if ((isString = (typeof property === "string")) && !(hasDot = ~property.indexOf("."))) {
      hasChanged = (oldValue = this.__context[property]) !== value;
      if (hasChanged) this.__context[property] = value;
    } else {

      // avoid split if possible
      var chain     = isString ? hasDot ? property.split(".") : [property] : property,
      ctx           = this.__context,
      currentValue  = ctx,
      previousValue = currentValue,
      currentProperty,
      newChain;

      for (var i = 0, n = chain.length - 1; i < n; i++) {

        currentProperty = chain[i];
        previousValue   = currentValue;
        currentValue    = currentValue[currentProperty];


        if (!currentValue || (typeof currentValue !== "object")) {
          currentValue = previousValue[currentProperty] = {};
        }


        // is the previous value bindable? pass it on
        if (currentValue.__isBindable) {

          newChain = chain.slice(i + 1);
          // check if the value has changed
          hasChanged = (oldValue = currentValue.get(newChain)) !== value;
          currentValue.set(newChain, value);
          break;
        }
      }

      if (!newChain && (hasChanged = (oldValue !== value))) {
        currentProperty = chain[i];
        oldValue = currentValue[currentProperty];
        currentValue[currentProperty] = value;
      }
    }

    if (!hasChanged) return;

    this.emit("change:" + property, value, oldValue);
    this.emit("change", property, value, oldValue);
    return value;
  },

  /**
   */

  bind: function (property, fn, now) {
    return watchProperty(this, property, fn, now);
  },

  /**
   */

  dispose: function () {
    this.emit("dispose");
  },

  /**
   */

  toJSON: function () {
    var obj = {}, value;

    for (var key in this.__context) {
      value = this.__context[key];
      
      if(value && value.__isBindable) {
        value = value.toJSON()
      }

      obj[key] = value;
    }
    return obj;
  }
});

module.exports                 = Bindable;
