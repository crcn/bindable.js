# Bindable.js [![Alt ci](https://travis-ci.org/classdojo/bindable.js.png)](https://travis-ci.org/classdojo/bindable.js)

Incredibly flexible, fast bi-directional data binding library. 

Two-way data binding means linking properties of two separate objects - when one changes, the other will automatically update with that change.  It enables much easier interactions between data models and UIs, among other uses outside of MVC.

Bindable.js is similar to Ember's data-binding system, except it doesn't include anything View related, so the library has many use-cases - whether replacing Backbone's Model, providing a way to maintain the state between server <-> client for a realtime front-end application (similar to Firebase), or perhaps a way to communicate between server <-> server for a realtime distributed Node.js application.


### Projects using bindable.js

- [Paperclip.js](https://github.com/classdojo/paperclip.js) - data-bindable templating engine.
- [Sherpa.js](https://github.com/classdojo/sherpa.js) - online tours library
- [Mojo.js](https://github.com/classdojo/mojo.js) - javascript MVC framework.
- [AWSM](https://github.com/crcn/node-awsm) - aws library.
- [ditto](https://github.com/browsertap/ditto.js) - synchronized user interactions across browsers.


### BindableObject Example

```javascript
var bindable = require("bindable");

var person = new bindable.Object({
  name: "craig",
  last: "condon",
  location: {
    city: "San Francisco"
  }
});

item.bind("location.zip", function(value) {
  // 94102
}).now();

//triggers the binding
item.set("location.zip", "94102"); 

//bind location.zip to another property in the model, and do it only once
item.bind("location.zip", { to: "zip", max: 1 }).now();

//bind location.zip to another object, and make it bi-directional.
item.bind("location.zip", { target: anotherModel, to: "location.zip", bothWays: true }).now();

//chain to multiple items, and limit it!
item.bind("location.zip", { to: ["property", "anotherProperty"], max: 1 }).now();


//you can also transform data as it's being bound
item.bind("name", {
  to: "name2",
  map: function (name) {
    return name.toUpperCase();
  }
}).now();
```

### Benchmark

Bindable.js is pretty fast. Here are a few benchmarks on a Mac 2.3 GHz Intel Core i7 with 16 GB (1600 MHz DDR3) of memory.

```
bindable.on('event', fn) 1 listener x 10,139,631 ops/sec ±0.47% (94 runs sampled)
bindable.on('event', fn) 2 listeners x 3,524,177 ops/sec ±0.32% (95 runs sampled)
bindable.bind('name', { to: fn }).dispose() x 602,661 ops/sec ±1.96% (85 runs sampled)
bindable.bind('name', fn).dispose() x 1,220,053 ops/sec ±0.57% (92 runs sampled)
bindable.bind('city.zip', fn).dispose() x 266,628 ops/sec ±1.01% (87 runs sampled)
sub bindable.bind('friend.name', fn).dispose() x 176,746 ops/sec ±1.04% (88 runs sampled)
bindable.bind('a.b.c.d.e', fn).dispose() x 143,059 ops/sec ±0.77% (91 runs sampled)
new bindable.Object() x 17,267,440 ops/sec ±0.72% (91 runs sampled)
bindable.get('firstName') x 14,650,011 ops/sec ±1.06% (88 runs sampled)
bindable.get('city.zip') x 5,896,941 ops/sec ±1.25% (91 runs sampled)
bindable.get('a.b.c') x 5,056,329 ops/sec ±0.97% (82 runs sampled)
bindable.get('a.b.c.d') x 4,661,307 ops/sec ±0.91% (90 runs sampled)
bindable.get(['city','zip']) x 28,287,374 ops/sec ±1.37% (81 runs sampled)
bindable.set('firstName', value) x 13,668,137 ops/sec ±0.98% (88 runs sampled)
bindable.set(['city', 'zip'], 55555) new x 1,895,868 ops/sec ±0.66% (95 runs sampled)
bindable.set(['city', 'zip'], 55555) existing x 1,939,437 ops/sec ±0.77% (86 runs sampled)
bindable.set('city.zip', 94111) new x 1,416,434 ops/sec ±0.69% (90 runs sampled)
bindable.set('city.zip', 94111) existing x 1,426,653 ops/sec ±0.85% (86 runs sampled)
```

## API

#### value bindable.get(property)

Returns a property on the bindable object

```javascript
var bindable = new bindable.Object({ city: { name: "SF" } });

console.log(bindable.get("city"));      // { name: "SF" }
console.log(bindable.get("city.name")); // SF
```

#### bindable.set(property, value)

Sets a value to the bindable object

```javascript
var obj = new bindable.Object();
bindable.set("city.name", "SF");
console.log(obj.get("city.name")); // SF
```

#### bindable.setProperties(properties)

sets multiple properties on the bindable object

```javascript
var person = new bindable.Object();
person.setProperties({
  firstName: "Jon",
  lastName: "Doe"
});
console.log(person.get("firstName"), person.get("lastName")); // Jon Doe
```

#### bindable.has(property)

Returns true if the bindable object has a given property

```javascript
var obj = new bindable.Object({ count: 0, male: false, name: "craig" });

console.log(obj.has("count")); // true
console.log(obj.has("male")); // true
console.log(obj.has("name")); // true
console.log(obj.has("city")); // false
```

#### Object bindable.context()

returns the context of the bindable object.

```javascript
var context = {};
var obj     = new bindable.Object(context);

console.log(obj.context() == context); // true
```

#### listener bindable.on(event, callback)

adds a new listener to the bindable object

#### bindable.emit(event[,args...])

emits a new event

#### bindable.once(event, callback)

listens to one event

#### bindable.removeAllListeners([type])

returns all the listeners on the bindable object

#### Events

Bindable objects emit a few events:

- `change:*` - emitted when a property changes on the bindable object. E.g: `change:location.zip`.
- `change` - emitted when any property changes on the bindable object
- `watching` - emitted when a property is being watched
- `dispose` - emitted when `dispose()` is called on a bindable object

#### binding bindable.bind(from, options)

`options` - the options for the binding
  - `to` - the property to bind to. Can be a `string`, `array`, or `function`
  - `target` - the target bindable object. Default is self
  - `max` - max number of times to run the data-binding
  - `when` - tests the data-bound value before setting
  - `map` - transforms the data-bound value
  - `bothWays` - makes the data-binding bi-directional.

```javascript
var obj = new bindable.Object({ name: "craig" });

//bind to name2
obj.bind("name", "name2").now();

//same as above, different style.
obj.bind("name", { to: "name2" }).now();

// bind the name, but transform it to upper case
obj.bind("name", { to: "name2", map: function (name) {
  return name.toUpperCase();
}}).now();
```


#### binding.now()

Executes a binding now

```javascript
var person = new bindable.Object({ name: "jeff" });
person.bind("name", function (name) {
  // called ~ name = jeff
}).now();

// above is triggered
person.set("name", "joe");
```

#### binding.dispose()

Disposes a binding

```javascript
var person = new bindable.Object({ name: "jeff" });

var binding = person.bind("name", function (name) {
  // called ~ name = jeff
}).now();

binding.dispose();

person.set("name", "jake"); // binding not triggered
```


#### MIT License

Copyright (C) 2014 ClassDojo


Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
