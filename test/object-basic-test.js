var bindable = require(".."),
expect       = require("expect.js");

describe("object-basic#", function () {

  it("can create a bindable object", function () {
    new bindable.Object();
  });

  it("cannot have a bindable object as the context of the bindable object", function () {
    var obj = new bindable.Object(), e;
    try {
      obj.context(new bindable.Object());
    } catch (err) {
      e = err;
    }
    expect(e.message).to.be("context cannot be a bindable object");
  });

  it("can have the context of the bindable object be itself", function () {
    var obj = new bindable.Object();
    obj.context(obj);
  });

  it("can call get() with one property", function () {
    var obj = new bindable.Object({ name: "jeff" });
    expect(obj.get("name")).to.be("jeff");
  });

  it("can call get() with a string property chain", function () {
    var obj = new bindable.Object({ city: { zip: 99999 }, a: { b: { c: { d: 5}}} });
    expect(obj.get("city.zip")).to.be(99999);
    expect(obj.get("a.b.c.d")).to.be(5);
  });

  it("returns undefined if a property doesn't exist", function () {
    expect(new bindable.Object().get("name")).to.be(undefined);
  });

  it("doesn't create an object if a property doesn't exist", function () {
    var obj = new bindable.Object();
    expect(obj.get("a.b.c.d")).to.be(undefined);
    expect(obj.get("a")).to.be(undefined);
  })

  it("can call get() with an array as the property", function () {
    var obj = new bindable.Object({ city: { zip: 99999 } });
    expect(obj.get(["city", "zip"])).to.be(99999);
  });


  it("can check if a property exists", function () {
    var obj = new bindable.Object({
      a: true,
      b: 0,
      c: "true"
    });
    expect(obj.has("a")).to.be(true);
    expect(obj.has("b")).to.be(true);
    expect(obj.has("c")).to.be(true);
  });

  it("returns the friend object", function () {
    var friend = new bindable.Object();
    var obj = new bindable.Object({ 
      friend: friend
    });

    expect(obj.get("friend")).to.be(friend);
    expect(obj.get(["friend"])).to.be(friend);
  });

  it("properly jsonifys a bindable object", function () {
    var obj = new bindable.Object({
      name: "craig",
      friend: new bindable.Object({
        name: "tim"
      })
    });
    var json = obj.toJSON();
    expect(json.name).to.be("craig");
    expect(json.friend.name).to.be("tim");
  });

  it("properly get()s when a property is a bindable object", function () {
    var obj = new bindable.Object({ 
      friend: new bindable.Object({ 
        name: "jake",
        friend: new bindable.Object({
          name: "jeff"
        })
      })
    });
    expect(obj.get("friend.name")).to.be("jake");
    expect(obj.get("friend.friend.name")).to.be("jeff");
  });


  it("properly get()s when the context of the bindable object is itself", function () {
    var obj = new bindable.Object();
    obj.context(obj);
    obj.name = "craig";
    expect(obj.get("name")).to.be("craig");
  });

  it("properly get()s if a property is a bindable object and the context is itself", function () {
    var friend = new bindable.Object();
    friend.context(friend);
    friend.name = "craig";
    var obj = new bindable.Object({
      friend: friend
    });
    expect(obj.get("friend.name")).to.be("craig");
  })

  it("can call set() with one property", function () {
    var obj = new bindable.Object();
    obj.set("name", "craig");
    expect(obj.get("name")).to.be("craig");
  });

  it("can call set() with a string property chain", function () {
    var obj = new bindable.Object();
    obj.set("city.zip", 99999);
    obj.set("a.b.c.d.e", 33333);
    expect(typeof obj.get("city")).to.be("object");
    expect(obj.get("city.zip")).to.be(99999);
    expect(obj.get("a.b.c.d.e")).to.be(33333);
  });

  it("can call set() with an array property", function () {
    var obj = new bindable.Object();
    obj.set(["a", "b", "c", "d", "e"], 99999);
    expect(typeof obj.get("a")).to.be("object");
    expect(obj.get("a.b.c.d.e")).to.be(99999);
  });

  it("returns the value that was assigned", function () {
    var obj = new bindable.Object();
    expect(obj.set("a.b.c.d", 99999)).to.be(99999);
    expect(obj.set("a.b.c.d", 55555)).to.be(55555);
    expect(obj.get("a.b.c.d")).to.be(55555);
  })

  it("properly set()s when a property is a bindable object", function () {
    var friend1 = new bindable.Object();
    var friend2 = new bindable.Object({ friend: friend1 });
    var obj = new bindable.Object({ friend: friend2 });
    obj.set("friend.name", "jake");
    obj.set("friend.friend.name", "jeff");
    expect(obj.get("friend.name")).to.be("jake");
    expect(obj.get("friend.friend.name")).to.be("jeff");
  });

  it("properly set()s when the context of the bindable object is itself", function () {
    var obj = new bindable.Object();
    obj.context(obj);
    obj.set("name", "craig");
    expect(obj.name).to.be("craig");
  });

  it("properly sets()s if a property is a bindable object and the context is itself", function () {
    var friend1 = new bindable.Object();
    friend1.context(friend1);
    var obj = new bindable.Object({ friend: friend1 });
    obj.set("friend.name", "sam");
    expect(obj.get("friend").name).to.be("sam");
  })

  it("emits a change event when a property changes", function (next) {
    var obj = new bindable.Object();
    obj.once("change", function (key, value) {
      expect(key).to.be("name");
      expect(value).to.be("liam");
      next();
    });
    obj.set("name", "liam");
  });

  it("emits a change:name event when a property changes", function (next) {
    var obj = new bindable.Object({ name: "craig" });
    obj.once("change:name", function (value, oldValue) {
      expect(value).to.be("liam");
      expect(oldValue).to.be("craig");
      next();
    });
    obj.set("name", "liam");
  });


  it("doesn't emit a change event when a property changes", function () {
    var obj = new bindable.Object({ name: "liam" }), emitted;
    obj.once("change", function (key, value) {
      expect(key).to.be("name");
      expect(value).to.be("liam");
      next();
    });
    obj.set("name", "liam");
    expect(emitted).to.be(undefined);
  });

  it("emits a change event on a sub model, and itself if the property changes", function () {
    var friend = new bindable.Object({ name: "jake" }),
    obj = new bindable.Object({ friend: friend }),
    emittedFriend, emittedObj;
    friend.on("change:name", function (value) {
      emittedFriend = value;
    });
    obj.on("change:friend.name", function (value) {
      emittedObj = value;
    });

    obj.set("friend.name", "blake");
    expect(emittedFriend).to.be("blake");
    expect(emittedObj).to.be("blake");
  });
});