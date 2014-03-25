var EventEmitter    = require("../core/eventEmitter"),
protoclass          = require("protoclass"),
watchProperty       = require("./watchProperty");

/**
 * @module mojo
 * @submodule mojo-core
 */

/**

BindableObjects make it easy to link properties of two separate objects - when one changes,
the other will automatically update with that change. It enables much easier interactions between data models and UIs,
among other uses outside of MVC.

<br>
<br>

BindableObjects provide a way to maintain the state between server <-> client for a realtime front-end
application (similar to Firebase), or perhaps a way to communicate between server <-> server for a realtime distributed Node.js
application.


### Example

```javascript
var bindable = require("bindable");

var person = new bindable.Object({
  name: "craig",
  last: "condon",
  location: {
    city: "San Francisco"
  }
});

person.bind("location.zip", function(value) {
  // 94102
}).now();

//triggers the binding
person.set("location.zip", "94102");

//bind location.zip to another property in the model, and do it only once
person.bind("location.zip", { to: "zip", max: 1 }).now();

//bind location.zip to another object, and make it bi-directional.
person.bind("location.zip", { target: anotherModel, to: "location.zip", bothWays: true }).now();

//chain to multiple items, and limit it!
person.bind("location.zip", { to: ["property", "anotherProperty"], max: 1 }).now();


//you can also transform data as it's being bound
person.bind("name", {
  to: "name2",
  map: function (name) {
    return name.toUpperCase();
  }
}).now();
```

@class BindableObject
@extends EventEmitter
*/

/**
 * Emitted when the bindable object is disposed. This happens
 * when the object is no-longer needed.
 * @event dispose
 */


/**
 * Emitted everytime a property changes
 * @event change
 * @param {String} property
 * @param {Object} value
 * @param {Object} oldValue
 */

/**
 * Emitted when a specific property changes
 * @event change:*
 * @param {Object} value
 * @param {Object} oldValue
 */



/**
 * @constructor
 * @param {Object} context context of the bindable object
 */


/**
 * emitted when a property is being watched
 * @event watching
 */


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
   * The context of the bindable object. Note that the context can be `this`.
   * @method context
   * @param {Object} data (optional) sets the context
   * @returns {Object} context
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
   * Returns the keys in the context
   * @method keys
   * @returns {Array}
   */

  keys: function () {
    return Object.keys(this.toJSON());
  },

  /**
   * Returns TRUE if a property exists in the context
   * @method has
   * @param {String} path
   * @returns {Boolean}
   */

  has: function (key) {
    return this.get(key) != null;
  },

  /**
   * Returns a property stored in the bindable object context
   * @method get
   * @param {String} path path to the value. Can be something like `person.city.name`.
   */

  get: function (property) {

    var isString;

    // optimal
    if ((isString = (typeof property === "string")) && !~property.indexOf(".")) {
      return this.__context[property];
    }

    // avoid split if possible
    var chain    = isString ? property.split(".") : property,
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
   * Calls a function on the bindable object
   * @method call
   * @param {String} path path to the method to call
   * @param {Array} arguments (optional) to pass to the function
   * @param {Function} callback (optional) callback for returned value
   */

  call: function (path, args, onResult) {

    if (typeof args === "function") {
      onResult = args;
      args = [];
    }

    if (!args) args = [];

    if (!onResult) onResult = function (err) {
      if (err) throw err;
    };

    if (Object.prototype.toString.call(args) !== "[object Array]") {
      return onResult(new Error("args must be an array"));
    }

    var self = this;

    this.bind(path, { max: 1, to: function (fn) {
      try {
        onResult(null, fn.apply(self, args));
      } catch (e) {
        onResult(e);
      }
    }}).now();
  },

  /**
   * Properties to set on the bindable object
   * @method setProperties
   * @param {Object} properties properties to set
   * @returns {BindableObject} this
   */

  setProperties: function (properties) {
    for (var property in properties) {
      this.set(property, properties[property]);
    }
    return this;
  },

  /**
   * Sets a property on the bindable object's context
   * @method set
   * @param {String} path path to the value. Can be something like `person.city.name`.
   */

  set: function (property, value) {

    var isString, hasChanged, oldValue;

    // optimal
    if ((isString = (typeof property === "string")) && !~property.indexOf(".")) {
      hasChanged = (oldValue = this.__context[property]) !== value;
      if (hasChanged) this.__context[property] = value;
    } else {

      // avoid split if possible
      var chain     = isString ? property.split(".") : property,
      ctx           = this.__context,
      currentValue  = ctx,
      previousValue,
      currentProperty,
      newChain;


      for (var i = 0, n = chain.length - 1; i < n; i++) {

        currentProperty = chain[i];
        previousValue   = currentValue;
        currentValue    = currentValue[currentProperty];


        // need to take into account functions - easier not to check
        // if value exists
        if (!currentValue /* || (typeof currentValue !== "object")*/) {
          currentValue = previousValue[currentProperty] = {};
        }

        // is the previous value bindable? pass it on
        if (currentValue.__isBindable) {



          newChain = chain.slice(i + 1);
          // check if the value has changed
          hasChanged = (oldValue = currentValue.get(newChain)) !== value;
          currentValue.set(newChain, value);
          currentValue = oldValue;
          break;
        }
      }


      if (!newChain && (hasChanged = (currentValue !== value))) {
        currentProperty = chain[i];
        oldValue = currentValue[currentProperty];
        currentValue[currentProperty] = value;
      }
    }

    if (!hasChanged) return value;

    var prop = chain ? chain.join(".") : property;

    this.emit("change:" + prop, value, oldValue);
    this.emit("change", prop, value, oldValue);
    return value;
  },

  /**
   * Binds a property to a function
   * @method bind
   * @param {String} property path to bind to.
   * @param {Object} listener `function` or `transformer` to bind to
   * @param {Boolean} now (optional) call binding now. Otherwise wait till property changes.
   * @returns {Binding}
   */

  bind: function (property, fn, now) {
    return watchProperty(this, property, fn, now);
  },

  /**
   * Disposes the bindable object. Emits `dispose`.
   * @method dispose
   */

  dispose: function () {
    this.emit("dispose");
  },

  /**
   * Converts the context to a JSON object
   * @method toJSON
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

module.exports = Bindable;
