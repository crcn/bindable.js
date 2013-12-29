var bindable = require(".."),
expect       = require("expect.js");

describe("transform#", function () {

  it("can transform into a function, and pass", function () {
    var obj = new bindable.Object({ name: "craig" }),
    called = 0;
    obj.bind("name", {
      to: function (name) {
        expect(name).to.be("craig");
        called++;
      }
    }).now();
    expect(called).to.be(1);
  });

  it("doesn't call 'to' if the value is undefined", function () {
    var obj = new bindable.Object(),
    called = 0;
    obj.bind("name", {
      to: function (name) {
        called++;
      }
    }).now();
    expect(called).to.be(0);
  });

  it("can change the default value", function () {
    var obj = new bindable.Object(),
    called = 0;
    var binding = obj.bind("name", {
      defaultValue: "craig",
      to: function (name) {
        expect(name).to.be(undefined);
        called++;
      }
    });

    binding.now();
    binding.now();

    expect(called).to.be(1);
  });

  it("can map a value", function (next) {
    var obj = new bindable.Object({ name: "jeff" });
    obj.bind("name", {
      map: function (name) { return name.toUpperCase(); },
      to: function (name) {
        expect(name).to.be("JEFF");
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
        expect(name).to.be("liam");
        next();
      }
    }).now();
    obj.set("name", "liam");
  });

  it("can bind a property both ways", function () {
    var obj = new bindable.Object({ name: "frank" });
    obj.bind("name", {
      to: "name2",
      bothWays: true
    }).now();
    expect(obj.get("name2")).to.be("frank");
    obj.set("name2", "chris");
    expect(obj.get("name")).to.be("chris");
    expect(obj.get("name2")).to.be("chris");
  });

  it("can assign to a property", function () {
    var obj = new bindable.Object({ name: "jeff" });
    obj.bind("name", {
      to: "name2"
    }).now();
    expect(obj.get("name2")).to.be("jeff");
  }); 

  it("can assign to an array of properties", function () {
    var obj = new bindable.Object({ name: "jeff" });
    obj.bind("name", {
      to: ["name2", "name3"]
    }).now();
    expect(obj.get("name2")).to.be("jeff");
    expect(obj.get("name3")).to.be("jeff");
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

    expect(obj.get("name2")).to.be("JEFF");
  });


  it("can transform to another bindable object", function () {
    var obj = new bindable.Object({ name: "sam" }),
    person = new bindable.Object()
    obj.bind("name", {
      target: person,
      to: "name"
    }).now();
    expect(person.get("name")).to.be("sam");
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
      expect(obj.get("full")).to.be("a b");
      next();
    }, 1)
  });
});