var bindable = require(".."),
expect       = require("chai").expect;

describe("transform#", function () {


  it("throw an error if 'to' is missing", function () {
    var err;
    try {
      new bindable.Object().bind("prop", {});
    } catch(e) {
      err = e;
    }
    expect(err.message).to.equal("missing 'to' option");
  });


  it("can transform into a function, and pass", function () {
    var obj = new bindable.Object({ name: "craig" }),
    called = 0;
    obj.bind("name", {
      to: function (name) {
        expect(name).to.equal("craig");
        called++;
      }
    }).now();
    expect(called).to.equal(1);
  });

  it("doesn't call 'to' if the value is undefined", function () {
    var obj = new bindable.Object(),
    called = 0;
    obj.bind("name", {
      to: function (name) {
        called++;
      }
    }).now();
    expect(called).to.equal(0);
  });

  it("can change the default value", function () {
    var obj = new bindable.Object(),
    called = 0;
    var binding = obj.bind("name", {
      defaultValue: "craig",
      to: function (name) {
        expect(name).to.equal(undefined);
        called++;
      }
    });

    binding.now();
    binding.now();

    expect(called).to.equal(1);
  });


  it("throws an error if 'to' is an unknown type", function () {
    var err;
    try {
      new bindable.Object().bind("abba", { to: 0 }).now();
    } catch(e) {
      err = e;
    }
    expect(err.message).to.equal("'to' must be a function");
  });

  it("can map a value", function (next) {
    var obj = new bindable.Object({ name: "jeff" });
    obj.bind("name", {
      map: function (name) { return name.toUpperCase(); },
      to: function (name) {
        expect(name).to.equal("JEFF");
        next();
      }
    }).now();
  });

  it("can provide a conditional 'when' option", function (next) {
    var calls = 0;
    var obj = new bindable.Object({ name: "jeff" });
    obj.bind("name", {
      when: function (name) { 
        return name !== "jeff";
      },
      to: function (name) {
        expect(name).to.equal("liam");
        next();
      }
    }).now();
    obj.set("name", "liam");
  });

  it("can use regexp for the 'when' option", function () {
    var obj = new bindable.Object({ name: "craig" });
    obj.bind("name", {
      when: /ben/,
      to: "name2"
    }).now();
    expect(obj.get("name2")).to.equal(undefined);
    obj.set("name", "blah");
    expect(obj.get("name2")).to.equal(undefined);
    obj.set("name", "ben");
    expect(obj.get("name2")).to.equal("ben");
  }); 

  it("can bind a property both ways", function () {
    var obj = new bindable.Object({ name: "frank" });
    obj.bind("name", {
      to: "name2",
      bothWays: true
    }).now();
    expect(obj.get("name2")).to.equal("frank");
    obj.set("name2", "chris");
    expect(obj.get("name")).to.equal("chris");
    expect(obj.get("name2")).to.equal("chris");
  });

  it("can assign to a property", function () {
    var obj = new bindable.Object({ name: "jeff" });
    obj.bind("name", {
      to: "name2"
    }).now();
    expect(obj.get("name2")).to.equal("jeff");
  }); 

  it("can assign to an array of properties", function () {
    var obj = new bindable.Object({ name: "jeff" });
    obj.bind("name", {
      to: ["name2", "name3"]
    }).now();
    expect(obj.get("name2")).to.equal("jeff");
    expect(obj.get("name3")).to.equal("jeff");
  });

  it("can assign to property with options", function () {
    var obj = new bindable.Object({ name: "jeff" });
    obj.bind("name", {
      to: {
        name2: {
          map: function (name) { return name.toUpperCase(); }
        }
      }
    }).now();

    expect(obj.get("name2")).to.equal("JEFF");
  });


  it("can transform to another bindable object", function () {
    var obj = new bindable.Object({ name: "sam" }),
    person = new bindable.Object()
    obj.bind("name", {
      target: person,
      to: "name"
    }).now();
    expect(person.get("name")).to.equal("sam");
  });


  it("can map multiple properties", function (next) {
    var obj = new bindable.Object({ first: "a", last: "b" });
    obj.bind("first, last", {
      map: function (a, b) {
        return a + " " + b;
      },
      to: "full"
    }).now();
    setTimeout(function () {  
      expect(obj.get("full")).to.equal("a b");
      next();
    }, 1)
  });

  it("can listen to a binding once", function () {
    var obj = new bindable.Object({ name: "a" }), calls = 0;
    obj.bind("name", { once: true, to: function () {
      calls++;
    }}).now();
    expect(calls).to.equal(1);
    obj.set("name", "b");
    expect(calls).to.equal(1);

  });

  // chains use a different watcher
  it("can listen to a chain once", function () {
    var obj = new bindable.Object({ a: { b: 1 }}), calls = 0;
    obj.bind("a.b", { once: true, to: function () {
      calls++;
    }}).now();
    expect(calls).to.equal(1);
    obj.set("a.b", 2);
    expect(calls).to.equal(1);
  });

  it("can set a max number of calls", function () {
    var obj = new bindable.Object({ a: 1 }), calls = 0;
    obj.bind("a", { max: 2, to: function () {
      calls++;
    }}).now();
    expect(calls).to.equal(1);
    obj.set("a", 2);
    expect(calls).to.equal(2);
    obj.set("a", 3);
    expect(calls).to.equal(2);
  });

  it("can set max number of calls, and disposes only when there is a value", function () {
    var obj = new bindable.Object(),
    calls = 0;
    obj.bind("a", { max: 1, to: function (v) {
      expect(v).to.equal(1);
      calls++;
    }}).now();
    obj.set("a", 1);
    expect(calls).to.equal(1);
  })

  it("can map a sub-value", function () {
    var obj = new bindable.Object({});
    obj.bind("a", {
      to: {
        abba: {
          map: function (v) {
            return v || "b";
          }
        }
      }
    }).now();
    expect(obj.get("abba")).to.equal("b");
  });

  it("doesn't set undefined property to another property that is defined", function () {
    var obj = new bindable.Object({ b: 5 });
    obj.bind("a", { to: "b" }).now();
    obj.bind("b", { to: "c" }).now();
    expect(obj.get("b")).to.equal(5);
    expect(obj.get("c")).to.equal(5);
  });

  it("doesn't maintain 'undefined' after mapping multiple values to one property", function (next) {
    var obj = new bindable.Object({
      a: true
    });

    obj.bind("a, b, c, d", {
      "to": {
        "abcd" : {
          map: function (a, b, c, d) {
            return a && b && c && d;
          }
        }
      }
    }).now();



    setTimeout(function () {
      obj.set("b", true);
      obj.set("c", true);
      obj.set("d", true);
      setTimeout(function () {
        expect(obj.get("abcd")).to.equal(true);
        next();
      }, 50);
    }, 10);

  });

});