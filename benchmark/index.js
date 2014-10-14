var Benchmark = require("benchmark"),
suite         = new Benchmark.Suite,
bindable      = require("..");


var friend = new bindable.Object({ name: "jake" });

var person = new bindable.Object({
  firstName: "craig",
  lastName: "condon",
  friend: friend,
  city: {
    zip: 99999
  },
  a: {
    b: {
      c: {
        d: 5
      }
    }
  }
});

suite.add("new bindable.Object({name:'ben'})", function () {
  new bindable.Object({ name: "ben" });
})

suite.add("bindable.on('event', fn) 1 listener", function () {
  person.on("event", function () {});
  person.emit("event");
  person.removeAllListeners("event");
})


suite.add("bindable.on('event', fn) 2 listeners", function () {
  person.on("event", function () {});
  person.on("event", function () {});
  person.emit("event");
  person.removeAllListeners("event");
})

suite.add("bindable.bind('name', { to: fn }).dispose()", function () {
  person.bind("name", { to: function(){} }).dispose()
})

suite.add("bindable.bind('name', { to: fn }).dispose()", function () {
  person.bind("name", { to: function(){} }).dispose()
})


suite.add("bindable.bind('name', fn).dispose()", function () {
  person.bind("name", function(){}).dispose()
})

suite.add("bindable.bind('city.zip', fn).dispose()", function () {
  person.bind("city.zip", function(){}).dispose()
})


suite.add("sub bindable.bind('friend.name', fn).dispose()", function () {
  person.bind("friend.name", function(){}).dispose()
})


suite.add("bindable.bind('a.b.c.d.e', fn).dispose()", function () {
  person.bind("a.b.c.d.e", function(){}).dispose()
})


suite.add("new bindable.Object()", function() {
  new bindable.Object();
});

suite.add("bindable.get('firstName')", function() {
  person.get("firstName")
});


suite.add("bindable.get('city.zip')", function() {
  person.get("city.zip");
});


suite.add("bindable.get('a.b.c')", function() {
  person.get("a.b.c");
});


suite.add("bindable.get('a.b.c.d')", function() {
  person.get("a.b.c.d");
});


suite.add("bindable.get(['city','zip'])", function() {
  person.get(["city", "zip"])
});


suite.add("bindable.set('firstName', value)", function() {
  person.set("firstName", "jake");
});



suite.add("bindable.set(['city', 'zip'], 55555) new", function() {
  person.set(["city", "zip"], 55555);
});

suite.add("bindable.set(['city', 'zip'], 55555) existing", function() {
  person.set(["city", "zip"], 55555);
});

suite.add("bindable.set('city.zip', 94111) new", function() {
  person.set("city.zip", 99999);
});


suite.add("bindable.set('city.zip', 94111) existing", function() {
  person.set("city.zip", 99999);
});



suite.on("cycle", function(event) {
  console.log(String(event.target));
});


suite.on("complete", function() {
  console.log("Fastest is '%s'", this.filter("fastest").pluck("name"));
});


suite.run({ async: true });