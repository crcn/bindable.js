var Benchmark = require("benchmark"),
suite         = new Benchmark.Suite,
bindable      = require("..");



var person = new bindable.Object({
  firstName: "craig",
  lastName: "condon"
}),
binding = person.bind("firstName", "firstName3").now(),
i = 0;


suite.add("new Object", function () {
  new Object();
})

suite.add("new bindable.Object", function() {
  new bindable.Object();
});


suite.add("new bindable.Collection", function() {
  new bindable.Collection();
})

suite.add("split regexp with coma", function () {
  "abba,abbbb".split(/[,\s]+/g)
})



suite.add("split regexp without coma", function () {
  "agaba".split(/[,\s]+/g)
})

suite.add("split dot", function () {
  "prop".split(".")
})



suite.add("create binding", function() {
  person.bind("firstName", "firstName2");
});

suite.add("firstName -> firstName2", function() {
  person.bind("firstName", "firstName2").once().now();
});


suite.add("change unbound value", function() {
  person.set("abba", "abba" + (i++));
}); 

suite.add("change firstName with pre-defined binding", function() {
  person.set("firstName", "abba" + (i++));
})

suite.add("compute firstName + lastName", function() {
  person.bind("firstName, lastName").map({
    to: function(firstName, lastName) {
      return [firstName, lastName].join(" ");
    }
  }).to("fullName").once().now();
});

suite.add("compute firstName + lastName both ways", function() {
  person.bind("firstName, lastName").map({
    to: function(firstName, lastName) {
      return [firstName, lastName].join(" ");
    },
    from: function(fullName) {
      return String(fullName).split(" ");
    }
  }).to("fullName").once().now();

  person.set("fullName", "jake anderson");
});




suite.on("cycle", function(event) {
  console.log(String(event.target));
});


suite.on("complete", function() {
  console.log("Fastest is '%s'", this.filter("fastest").pluck("name"));
});


suite.run({ async: true });