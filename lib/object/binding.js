var protoclass      = require("protoclass"),
BindableSetter      = require("./setters/factory"),
bindableSetter      = new BindableSetter(),
utils               = require("../core/utils"),
options             = require("../utils/options"),
toarray             = require("toarray"),
DeepPropertyWatcher = require("./deepPropertyWatcher"),
type                = require("type-component"),
_                   = require("underscore");



function Binding (from, properties) {
  var p = this._properties = ~properties.indexOf(",") ? properties.split(/[,\s]+/g) : [properties]

  this._from = from;
  this._limit        = -1
  this._delay        = p.length === 1 ? options.delay : options.computedDelay
  this._setters      = [];
  this._triggerCount = 0;
  this.map(function(value) { return value });

  this._listen();
}


protoclass(Binding, {

  /**
   */

  now: function () {  

    var nvalues, hasChanged;


    if(this._listeners)
    if (this._listeners.__isPropertyWatcher) {
      nvalues = [this._listeners.value()];
    } else  {
      var n = this._listeners.length;
      nvalues = new Array(n);
      for (var i = 0; i < n; i++) {
        nvalues[i] = this._listeners[i].value();
      }
    } else {
      nvalues = [];
    }

    if(this._setters)
    if (typeof this._setters === "function") {
      hasChanged = this._setters.change(nvalues);
    } else {
      for (var i = 0, n = this._setters.length; i < n; i++) {
        hasChanged = this._setters[i].change(nvalues) || hasChanged;
      }
    }

    if (hasChanged && (~this._limit && ++this._triggerCount >= this._limit)) {
      this.dispose();
    }

    return this;
  },

  /**
   */

  collection: function () {
    if (this._collectionBinding) return this._collectionBinding;
    this._collection = new Binding.Collection();
    this.to(this._collection.source);
    this.now();
    return this._collectionBinding = this._collection.bind().copyId(true);
  },

  /**
   */

  to: function(target, property) {
    var setter = bindableSetter.createSetter(this, target, property);

    if (setter)
    if (!this._setters) {
      this._setters = setter;
    } else if (typeof this._setters === "function") {
      this._setters = [this._setters, setter];
    } else {
      this._setters.push(setter);
    }

    return this;
  },

  /**
   */

  from: function (from, property) {

    if (arguments.length === 1) {
      property = from;
      from = this._from;
    }

    return from.bind(property).to(this._from, this._properties);
  },

  /**
   */

  map: function (options) {
    if (!arguments.length) return this._map;
    this._map = utils.transformer(options);
    return this;
  },

  /**
   */

  once: function () {
    return this.limit(1);
  },

  /**
   */

  limit: function(count) {
    this._limit = count;
    return this;
  },

  /**
   */

  isBothWays: function () {
    return this._boundBothWays;
  },

  /**
   */

  bothWays: function () {
    if (this._boundBothWays) return this;
    this._boundBothWays = true;

    if (typeof this._setters === "function") {
      this._setters.bothWays();
    } else {
      for (var i = this._setters.length; i--;) {
        this._setters[i].bothWays();
      }
    }
    return this;
  },

  /**
   */

  delay: function (value) {
    if (!arguments.length) return this._delay;
    this._delay = value;
    this._listen();
    return this;
  },

  /**
   */

  dispose: function () {

    if(this._setters)
    if(typeof this._setters === "function") {
      this._setters.dispose()
    } else {
      for (var i = this._setters.length; i--;) {
        this._setters[i].dispose();
      }
    }
    this._setters = null;

    if (this._collectionBinding) {
      this._collectionBinding.dispose();
      this._collection.dispose();
    }

    this._dlisteners();
    return this;
  },

  /**
   */

  _dlisteners: function () {
    if (this._listeners) {
      if (typeof this._listeners === "function") {
        this._listeners.dispose();
      } else {
        for (var i = this._listeners.length; i--;) {
          this._listeners[i].dispose();
        }
      }
    }

    if (this._disposeListener) {
      this._disposeListener.dispose();
    }

    this._listeners        = null;
    this._disposeListeners = null;
  },

  /**
   */

  _listen: function () {
    this._dlisteners();    

    var listeners, props = this._properties, self = this;


    if (props.length === 1) {
      listeners = new DeepPropertyWatcher({
        parent: this,
        target: this._from,
        path: props[0].split("."),
        index: 0,
        delay: this._delay
      });
    } else {
      listeners = new Array(props.length);

      for(var i = props.length; i--;) {
        listeners[i] = new DeepPropertyWatcher({
          parent: this,
          target: this._from,
          path: props[i].split("."),
          index: 0,
          delay: this._delay
        });
      }
    }


    this._disposeListener = this._from.once("dispose", function () {
      self.dispose();
    });

    this._listeners = listeners;
  }


});

Binding.fromOptions = function(target, options) {
  var binding, t, to, tops, _i, _len, _ref;

  binding = target.bind(options.from || options.property);
  if (type(options.to) === "object") {
    for (to in options.to) {
      tops = options.to[to];
      if (tops.transform || tops.map) {
        binding.map(tops.transform || tops.map);
      }
      if (tops.now) {
        binding.now();
      }
      if (tops.bothWays) {
        binding.bothWays();
      }
      binding.to(to);
    }
  } else {
    options.to = toarray(options.to);
    _ref = options.to;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      t = _ref[_i];
      tops = typeof t === "object" ? t : {
        property: t
      };
      if (tops.transform || tops.map) {
        bindings.map(tops.transform || tops.map);
      }
      binding.to(tops.property);
    }
  }
  if (options.limit) {
    binding.limit(options.limit);
  }
  if (options.once) {
    binding.once();
  }
  if (options.bothWays) {
    binding.bothWays();
  }
  if (options.now) {
    binding.now();
  }
  return binding;
};


module.exports = Binding;