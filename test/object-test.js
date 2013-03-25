var BindableObject = require("../").Object,
expect = require("expect.js");

describe("bindable object", function() {

  var bindable, binding;

  
  it("can be created", function() {
    bindable = new BindableObject({
      name: {
        first: "craig",
        last: "craig"
      },
      location: {
        city: "San Francisco"
      }
    });
  });

  
  
  it("can bind to location.zip", function(next) {

    bindable.bind("location.zip", function(value) {
      expect(value).not.to.be(undefined);
      next();
    }).once();

    bindable.set("location.zip", "94102");
  });


  it("can do perform a deep bind", function(next) {
    bindable.bind("a.b.c.d.e", function(value) {
      expect(value).to.be(1);
      next();
    }).once();

    bindable.set("a", { b: {c: { d: { e: 1 }}}})
  });


  it("can bind to a property", function() {

    bindable.bind("name", "name2").once()
    expect(bindable.get("name2.first")).to.be("craig");

    bindable.bind("doesntexist", "doesntexist2").once()
    expect(bindable.get("doesntexist2")).to.be(undefined);

    bindable.set("doesntexist", 5)
    expect(bindable.get("doesntexist2")).to.be(5);
  });


  it("previous name binding is not bound anymore", function() {
    bindable.set("doesntexist", 6);
    expect(bindable.get("doesntexist2")).to.be(5);
  })


  it("can be bound both ways", function() {
    bindable.bind("age", "age2").bothWays().limit(1)
    bindable.set("age", 5);
  });

  it("age should be 5", function() {
    expect(bindable.get("age")).to.be(5);
  });

  it("age2 should be 5", function() {
    expect(bindable.get("age2")).to.be(5);
    bindable.set("age2", 6);
  });

  it("age should be 6", function() {
    expect(bindable.get("age")).to.be(6);
  });

  it("age2 should be 6", function() {
    expect(bindable.get("age2")).to.be(6);
  });


  it("previous age binding is not bound anymore", function() {
    bindable.set("age2", 8);
    expect(bindable.get("age")).to.be(6);
  });

  it("previous age2 binding is not bound anymore", function() {
    bindable.set("age", 7);
    expect(bindable.get("age2")).to.be(8);
  });

  it("can be bound multiple times", function() {
    bindable.bind("count").to("count2").to("count3").once();
    bindable.set("count", 99);
    expect(bindable.get("count")).to.be(99);
    expect(bindable.get("count2")).to.be(99);
    expect(bindable.get("count3")).to.be(99);
  });


  it("can be bound to a binding", function() {
    binding = bindable.bind("fish");
    bindable.set("fish2", binding);
    binding._from.set("fish", "sauce");
  });

  it("fish2 should be sauce", function() {
    expect(bindable.get("fish2")).to.be("sauce")
  });

  it("can bind fish2 the other way", function() {
    binding.bothWays().once();
    bindable.set("fish2", "sticks");
  });

  it("fish should be sticks", function() {
    expect(bindable.get("fish")).to.be("sticks")
    bindable.set("fish2", "sauce");
  });

  it("fish should still be sticks", function() {
    expect(bindable.get("fish")).to.be("sticks")
  });

  it("can transform one finding type to another synchronously", function() {

    bindable.set("name", "craig").bind("name").transform(function(value) {
      return value.toUpperCase();
    }).to("name2").once();

    expect(bindable.get("name2")).to.be("CRAIG");
  });

  it("can transform an object asynchronously", function(next) {

    bindable.set("name3", "sam").bind("name3").transform(function(value, next) {
      setTimeout(next, 1, null, value.toUpperCase());
    }).to("name4").once();

    setTimeout(function() {
      expect(bindable.get("name4")).to.be("SAM");
      next();
    }, 4);
  });

  it("can transform an object to and from", function() {
    var binding = bindable.set("name", "chris").bind("name").transform({
      to: function(name) {
        return name.toUpperCase();
      },
      from: function(name) {
        return name.toLowerCase();
      }
    }).to("name2").bothWays();

    expect(bindable.get("name2")).to.be("CHRIS");
    bindable.set("name2", "LIAM");
    expect(bindable.get("name")).to.be("liam");

    binding.dispose();
  });


  it("can bind to a sub-binding", function() {

    var subBindable = new BindableObject({
      "first": "craig",
      "last": "craig"
    });

    var changedLast;

    bindable.set({
      name: subBindable
    });

    bindable.bind("name.last", function(value) {
      changedLast = value;
    }).once();

    bindable.get("name").set("last", "jefferds");
    expect(changedLast).to.be("jefferds");
  });


  it("can bind to a sub-binding 2", function() {

    var subBindable = new BindableObject({
      "first": "craig",
      "last": "craig"
    });

    var changedLast;

    bindable.set({
      name: subBindable
    });

    bindable.bind("name.last", function(value) {
      changedLast = value;
    }).once();

    bindable.set("name.last", "jefferds");
    expect(changedLast).to.be("jefferds");
  })

});