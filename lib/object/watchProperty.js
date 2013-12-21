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

    var subChain, subValue, currentProperty, j, computed;


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

        subChain        = chain.slice(0, i + 1);
        currentProperty = chain[i];

        // check for @ at the beginning
        if (currentProperty.charCodeAt(0) === 64) {

          // remove @ - can't be used to fetch the propertyy
          subChain[i] = subChain[i].substr(1);
          computed = true;
        }

        // fetch the property
        subValue        = target.get(subChain);

        if (computed && subValue) {
          var context = target.get(subChain.slice(0, subChain.length - 1));

          if (subValue.compute) {
            for (var i = subValue.compute.length; i--;) {
              bind(target, subValue.compute[i]);
            }
          }

          var eachChain = chain.slice(i + 1);

          // call the function, looping through items
          subValue.call(context, function (item) {

            if (!eachChain.length) {
              if (!values) values = [];
              values.push(item);
            }

            // must be a bindable object to continue
            if (item && item.__isBindable) {
              bind(item, eachChain);
            }
          });
        } else if (subValue && subValue.__isBindable) {
          bind(subValue, chain.slice(i + 1));
        }

        listeners.push(target.on("change:" + subChain.join("."), onChange));
      } 
    } else {



      for (var i = 0, n = chain.length; i < n; i++) {

        subChain        = chain.slice(0, i + 1);
        subValue        = target.get(subChain);

        // pass the watch onto the bindable object, but also listen 
        // on the current target for any
        if (subValue && subValue.__isBindable) {
          bind(subValue, chain.slice(i + 1));
        }

        listeners.push(target.on("change:" + subChain.join("."), onChange));
      }
      values = subValue;
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

function watchProperty (bindable, property, fn) {

  // person.bind("firstName, lastName")
  if (~property.indexOf(",")) return watchMultiple(bindable, property.split(/[,\s*]+/).forEach(function (prop) {
    return prop.split(".");
  }), fn);

  var chain        = property.split(".");

  // collection.bind("length")
  if (chain.length === 1) return watchSimple(bindable, property, fn);

  // person.bind("city.zip")
  return watchChain(bindable, ~property.indexOf("@"), chain, fn);
}

module.exports = watchProperty;