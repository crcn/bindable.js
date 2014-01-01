var _     = require("underscore"),
transform = require("./transform"),
options   = require("../utils/options");

/**
 * bindable.bind("a", fn);
 */

function watchSimple (bindable, property, fn) {

  bindable.emit("watching", [property]);

  var listener = bindable.on("change:" + property, function () {
    fn.apply(self, arguments);
  }), self;

  return self = {
    now: function () {
      fn.call(self, bindable.get(property));
      return self;
    },
    dispose: function () {
      listener.dispose();
    }
  }
}

/**
 * bindable.bind("a.b.c.d.e", fn);
 */


function watchChain (bindable, hasComputed, chain, fn) {

  var listeners = [], values = hasComputed ? [] : undefined, self;

  function onChange () {
    dispose();
    listeners = [];
    values = hasComputed ? [] : undefined;
    bind(bindable, chain);
    self.now();
  }

  function bind (target, chain, pushValues) {

    var currentChain = [], subValue, currentProperty, j, computed, hadComputed, pv, cv = target.context()

    // need to run through all variations of the property chain incase it changes
    // in the bindable.object. For instance:
    // target.bind("a.b.c", fn); 
    // triggers on
    // target.set("a", obj);
    // target.set("a.b", obj);
    // target.set("a.b.c", obj);

    // does it have @each in there? could be something like
    // target.bind("friends.@each.name", function (names) { })
    if (hasComputed) {

      for (var i = 0, n = chain.length; i < n; i++) {

        currentChain.push(chain[i]);
        currentProperty = chain[i];

        target.emit("watching", currentChain);

        // check for @ at the beginning
        if (computed = (currentProperty.charCodeAt(0) === 64)) {
          hadComputed = true;
          // remove @ - can't be used to fetch the propertyy
          currentChain[i] = currentProperty = currentChain[i].substr(1);
        }
        
        pv = cv;
        if (cv) cv = cv[currentProperty];

        // check if 
        if (computed && cv) {


          // used in cases where the collection might change that would affect 
          // this binding. length for instance on the collection...
          if (cv.compute) {
            for (var j = cv.compute.length; j--;) {
              bind(target, [cv.compute[j]], false);
            }
          }

          // the sub chain for each of the items from the loop
          var eachChain = chain.slice(i + 1);

          // call the function, looping through items
          cv.call(pv, function (item) {

            if (!item) return;

            // wrap around bindable object as a helper
            if (!item.__isBindable) {
              item = new module.exports.BindableObject(item);
            }

            bind(item, eachChain);
          });
          break;
        } else if (cv && cv.__isBindable) {
          bind(cv, chain.slice(i + 1));
          cv = cv.__context;
        }

        listeners.push(target.on("change:" +  currentChain.join("."), onChange));

      } 


      if (!hadComputed && pushValues !== false) {
        values.push(cv);
      }

    } else {

      for (var i = 0, n = chain.length; i < n; i++) {
        currentProperty = chain[i];
        currentChain.push(currentProperty);

        target.emit("watching", currentChain);

        if (cv) cv = cv[currentProperty];

        // pass the watch onto the bindable object, but also listen 
        // on the current target for any
        if (cv && cv.__isBindable && i !== n - 1) {
          bind(cv, chain.slice(i + 1), false);
          cv = cv.__context;
        }

        listeners.push(target.on("change:" + currentChain.join("."), onChange));
        
      }

      if (pushValues !== false) values = cv;
    }


  }

  function dispose () {
    if (!listeners) return;
    for (var i = listeners.length; i--;) {
      listeners[i].dispose();
    }
    listeners = undefined;
  }

  bind(bindable, chain);

  return self = {
    now: function () {
      fn.call(self, values);
      return self;
    },
    dispose: dispose
  }
}

/**
 */

function watchMultiple (bindable, chains, fn) { 

  var values = new Array(chains.length),
  oldValues  = new Array(chains.length),
  bindings   = new Array(chains.length),
  fn2        = options.computedDelay === -1 ? fn : _.debounce(fn, options.computedDelay),
  self;

  chains.forEach(function (chain, i) {

    function onChange (value, oldValue) {
      values[i]    = value;
      oldValues[i] = oldValue;
      fn2.apply(this, values.concat(oldValues));
    }

    bindings[i] = bindable.bind(chain, onChange);
  });

  return self = {
    target: bindable,
    now: function () {
      for (var i = bindings.length; i--;) {
        bindings[i].now();
      }
      return self;
    },
    dispose: function () {
      for (var i = bindings.length; i--;) {
        bindings[i].dispose();
      }
    }
  }
}

/**
 */

function watchProperty (bindable, property, fn) {

  if (typeof fn === "object") {
    fn = transform(bindable, property, fn);
  }

  var watcher, chain;

  // person.bind("firstName, lastName")
  if (~property.indexOf(",")) {
    watcher = watchMultiple(bindable, property.split(/[,\s]+/), fn);
  } else {

    chain = property.split(".");

    // collection.bind("length")
    if (chain.length === 1) {
      watcher = watchSimple(bindable, property, fn);

    // person.bind("city.zip")
    } else {
      watcher = watchChain(bindable, ~property.indexOf("@"), chain, fn);
    }
  }

  return watcher;
}

module.exports = watchProperty;