var toarray = require("toarray"),
_           = require("underscore");

/*

bindable.bind("property", {
  when: tester,
  defaultValue: defaultValue,
  map: function(){},
  to: ["property"],
  to: {
    property: {
      map: function (){}
    }
  }
}).now();

*/

function getToPropertyFn (target, property) {
  return function (value) {
    target.set(property, value);
  };
}

function transform (bindable, fromProperty, options) {

  var when        = options.when         || function() { return true; },
  map             = options.map          || function () { return Array.prototype.slice.call(arguments, 0); },
  target          = options.target       || bindable,
  max             = options.max          || (options.once ? 1 : undefined) || -1,
  tos             = toarray(options.to).concat(),
  previousValues  = toarray(options.defaultValue),
  toProperties    = [],
  bothWays        = options.bothWays;
  
  if (typeof when === "function") {
    when = { test: when };
  }


  if (!previousValues.length) {
    previousValues.push(undefined)
  }

  if (!tos.length) {
    throw new Error("missing 'to' option");
  }

  for (var i = tos.length; i--;) {
    var to = tos[i],
    tot    = typeof to;

    /*
     need to convert { property: { map: fn}} to another transformed value, which is
     { map: fn, to: property }
     */

    if (tot === "object") {

      // "to" might have multiple properties we're binding to, so 
      // add them to the END of the array of "to" items
      for (var property in to) {

        // assign the property to the 'to' parameter
        to[property].to = property;
        tos.push(transform(target, fromProperty, to[property]));
      }

      // remove the item, since we just added new items to the end
      tos.splice(i, 1);

    // might be a property we're binding to
    } else if(tot === "string") {
      toProperties.push(to);
      tos[i] = getToPropertyFn(target, to);
    } else if (tot !== "function") {
      throw new Error("'to' must be a function");
    }
  }

  // two-way data-binding
  if (bothWays) {
    for (var i = toProperties.length; i--;) {
      target.bind(toProperties[i], { to: fromProperty });
    }
  }

  var numCalls = 0;

  // newValue, newValue2, oldValue, oldValue2
  return function () {

    var values = toarray(map.apply(this, arguments)),
    newValues  = (values.length % 2) === 0 ? values.slice(0, values.length / 2) : values;

    if (_.intersection(newValues, previousValues).length === previousValues.length) {
      return;
    }

    if (~max && ++numCalls >= max) {
      this.dispose();
    }

    previousValues = newValues;

    // first make sure that we don't trigger the old value
    if (!when.test.apply(when, values)) return;

    for (var i = tos.length; i--;) {
      tos[i].apply(this, values);
    }
  };
};

module.exports = transform;