var Benchmark = require("benchmark"),
suite         = new Benchmark.Suite,
bindable      = require("..");



var person = new bindable.Object({
  firstName: "craig",
  lastName: "condon",
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


suite.add("bindable.set('city.zip', 94111) new", function() {
  person.set("city.zip", 99999);
});


suite.add("bindable.set('city.zip', 94111) existing", function() {
  person.set("city.zip", 99999);
});


suite.add("bindable.set(['city', 'zip'], 55555) new", function() {
  person.set(["city", "zip"], 55555);
});

suite.add("bindable.set(['city', 'zip'], 55555) existing", function() {
  person.set(["city", "zip"], 55555);
});




suite.on("cycle", function(event) {
  console.log(String(event.target));
});


suite.on("complete", function() {
  console.log("Fastest is '%s'", this.filter("fastest").pluck("name"));
});


suite.run({ async: true });