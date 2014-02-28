var bindable = require(".."),
expect       = require("chai").expect;

describe("object-bind#", function () {


  // emit watching
  it("can bind one property", function (next) {
    var obj = new bindable.Object();
    obj.bind("name", function (value) {
      expect(value).to.equal("monica");
      next();
    });
    obj.set("name", "monica");
  })


  it("can bind to a property chain", function (next) {
    var obj = new bindable.Object();
    obj.bind("city.zip", function (value) {
      expect(value).to.equal(99999);
      next();
    });
    obj.set("city.zip", 99999);
  });

  it("can bind now to a defined value", function (next) {
    var obj = new bindable.Object({ name: "steph" });
    obj.bind("name", function (value) {
      expect(value).to.equal("steph");
      next();
    }).now();
  });

  it("can call 'now' multiple times", function () {
    var obj = new bindable.Object({ name: "steph" }), called = 0;
    var binding = obj.bind("name", function (value) {
      expect(value).to.equal("steph");
      called++;
    });
    binding.now();
    binding.now();
    expect(called).to.equal(2);
  });

  it("can bind now to an undefined value", function (next) {
    var obj = new bindable.Object();
    obj.bind("name", function (value) {
      expect(value).to.equal(undefined);
      next();
    }).now();
  });

  it("can dispose a binding", function () {
    var obj = new bindable.Object(), calls = 0;
    obj.bind("name", function () {
      calls++;
    }).dispose();
    obj.set("name", "jeff");
    expect(calls).to.equal(0);
  })


  it("can bind to a property owned by another bindable object", function () {
    var friend1 = new bindable.Object({ name: "joe" });
    var friend = new bindable.Object({ name: "josh", friend:  friend1 }),
    obj = new bindable.Object({ friend: friend }),
    boundValue, subBoundValue;

    obj.bind("friend.friend.name", function (value) {
      subBoundValue = value;
    }).now();

    obj.bind("friend.name", function (value) {
      boundValue = value;
    }).now();

    expect(subBoundValue).to.equal("joe");
    expect(boundValue).to.equal("josh");
    friend.set("name", "jake");
    friend1.set("name", "tim");
    expect(boundValue).to.equal("jake");
    expect(subBoundValue).to.equal("tim");
    obj.set("friend.name", "jeff");
    obj.set("friend.friend.name", "blah");
    expect(boundValue).to.equal("jeff");
    expect(subBoundValue).to.equal("blah");
  });

  it("can dispose a sub-bound value", function () {
    var friend = new bindable.Object({ name: "craig" }),
    obj = new bindable.Object({ friend: friend }),
    boundValue;

    obj.bind("friend.name", function (value) {
      boundValue = value;
    }).dispose();

    obj.set("friend.name", "josh");
    expect(boundValue).to.equal(undefined);
  });

  it("still binds after sub bindable object is set", function () {
    var friend = new bindable.Object({ name: "craig" }),
    obj = new bindable.Object(), 
    boundValue;

    obj.bind("friend.name", function(value) {
      boundValue = value;
    }).now();

    expect(boundValue).to.equal(undefined);
    obj.set("friend", friend);
    expect(boundValue).to.equal("craig");
  });

  it("can bind to a computed property", function (next) {
    var friends = [{ name: "sam" }, { name: "liam" }];
    var obj = new bindable.Object({
      friends: friends
    });

    obj.bind("friends.@forEach", function (people) {
      expect(people[0].get("name")).to.equal("sam");
      expect(people[1].get("name")).to.equal("liam");
      next();
    }).now();
  });


});