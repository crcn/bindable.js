/**
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
 */

function watchChain (bindable, chain, fn) {

  var listeners = [], self;

  function onChange () {
    dispose();
    listeners = [];
    bind(bindable, chain);
    fn(bindable.get(chain));
  }

  function bind (target, chain) {

    for (var i = 0, n = chain.length; i < n; i++) {
      var subChain = chain.slice(0, i + 1),
      subValue     = target.get(subChain);

      // pass the watch onto the bindable object, but also listen 
      // on the current target for any changes
      if (subValue && subValue.__isBindable) {
        bind(subValue, chain.slice(i + 1));
      }

      listeners.push(target.on("change:" + subChain.join("."), onChange));
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
      fn(bindable.get(chain));
    },
    dispose: dispose
  }
}

/**
 */

module.exports = function (bindable, property, fn) {

  var computed = ~property.indexOf("@"),
  chain        = property.split(".");

  // collection.bind("@each.name")
  if (computed) return;

  // collection.bind("length")
  if (chain.length === 1) return watchSimple(bindable, property, fn);

  // person.bind("city.zip")
  return watchChain(bindable, chain, fn);
}