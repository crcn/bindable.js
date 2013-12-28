_ = require("underscore");

/**
 * bindable.bind("a", fn);
 */

function watchSimple (bindable, property, fn) {
  var listener = bindable.on("change:" + property, fn);
 
  return {
    now: function () {
      fn(bindable.get(property));
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

  var listeners = [], values, self;

  function onChange () {
    dispose();
    listeners = [];
    values = undefined;
    bind(bindable, chain);
    self.now();
  }

  function bind (target, chain) {

    var currentChain = [], subValue, currentProperty, j, computed, hadComputed, pv, cv = target;

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

        // check for @ at the beginning
        if (computed = (currentProperty.charCodeAt(0) === 64)) {
          hadComputed = true;
          // remove @ - can't be used to fetch the propertyy
          currentChain[i] = currentProperty = currentChain[i].substr(1);
        }
    
        if (cv) {
          if (cv.__isBindable) {
            cv = cv.__context[currentProperty];
          } else {
            cv = cv[currentProperty];
          }
        }

        // check if 
        if (computed && cv) {

          if (!values) values = [];

          // context of the function
          var context = target.get(currentChain.slice(0, currentChain.length - 1));

          // used in cases where the collection might change that would affect 
          // this binding. length for instance on the collection...
          if (cv.compute) {
            for (var i = cv.compute.length; i--;) {
              bind(target, cv.compute[i]);
            }
          }

          // the sub chain for each of the items from the loop
          var eachChain = chain.slice(i + 1);

          // call the function, looping through items
          cv.call(context, function (item) {

            if (!eachChain.length) {
              values.push(item);
              return;
            }

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
        }

        listeners.push(target.on("change:" + currentChain.join("."), onChange));
      } 

      if (!hadComputed) {
        values.push(cv);
      }

    } else {

      for (var i = 0, n = chain.length; i < n; i++) {

        currentChain.push(chain[i]);

        if (cv) {
          if (cv.__isBindable) {
            cv = cv.__context[chain[i]];
          } else {
            cv = cv[chain[i]];
          }
        }

        // pass the watch onto the bindable object, but also listen 
        // on the current target for any
        if (cv && cv.__isBindable) {
          bind(cv, chain.slice(i + 1));
        }

        listeners.push(target.on("change:" + currentChain.join("."), onChange));
      }
      values = cv;
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
      fn(values);
    },
    dispose: dispose
  }
}

/**
 */

function watchMultiple (bindable, chains, fn) { 

  var values = new Array(chains.length),
  oldValues  = new Array(chains.length),
  bindings   = new Array(chains.length);

  var fn2 = _.debounce(function () {
    fn.apply(this, values)
  }, 0);

  chains.forEach(function (chain, i) {

    function onChange (value, oldValue) {
      values[i]    = value;
      oldValues[i] = oldValue;
      fn2();
    }

    bindings[i] = bindable.bind(chain, onChange);
  });

  return {
    now: function () {
      for (var i = bindings.length; i--;) {
        bindings[i].now();
      }
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

  // person.bind("firstName, lastName")
  if (~property.indexOf(",")) return watchMultiple(bindable, property.split(/[,\s]+/), fn);

  var chain        = property.split(".");

  // collection.bind("length")
  if (chain.length === 1) return watchSimple(bindable, property, fn);

  // person.bind("city.zip")
  return watchChain(bindable, ~property.indexOf("@"), chain, fn);
}

module.exports = watchProperty;