var BindableObject = require("../").Object,
expect = require("expect.js");

describe("bindable object", function() {

  var bindable, binding;
  
  it("can be created", function() {
    bindable = new BindableObject({
      name: {
        first: "craig",
        last: "con"
      },
      location: {
        city: "San Francisco"
      }
    });
  });

  it("can do perform a deep bind2", function(next) {
    bindable.bind("f.g.h.i", function(value) {
      expect(value).to.be(1);
      next();
    }).once().now();

    bindable.set("f.g.h", { i: 1 });
  });

  
  it("can reset an object", function() {
    var obj = new BindableObject({
      a:1,
      b:2,
      c:3
    })

    obj.reset({c:4,d:5});
    expect(obj.get("a")).to.be(undefined)
    expect(obj.get("b")).to.be(undefined)
    expect(obj.get("c")).to.be(4)
    expect(obj.get("d")).to.be(5)
  })
  
  it("can bind to location.zip", function(next) {

    bindable.bind("location.zip", function(value) {
      expect(value).not.to.be(undefined);
      next();
    }).once().now();

    bindable.set("location.zip", "94102");
  });



  it("can do perform a deep bind", function(next) {
    bindable.bind("a.b.c.d.e", function(value) {
      expect(value).to.be(1);
      next();
    }).once().now();

    bindable.set("a", { b: {c: { d: { e: 1 }}}})
  });



  it("can bind to a property", function() {

    bindable.bind("name", "name2").once().now();
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
    bindable.bind("age", "age2").bothWays().limit(2)
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
    bindable.bind("count").to("count2").to("count3").once().now();
    bindable.set("count", 99);
    expect(bindable.get("count")).to.be(99);
    expect(bindable.get("count2")).to.be(99);
    expect(bindable.get("count3")).to.be(99);
  });


  it("can listen for multiple change events", function() {
    var bindable = new BindableObject({
      person: new BindableObject({
        name: new BindableObject({
          first: "craig",
          last: "craig"
        })
      })
    });

    var pn, binding = bindable.bind("person.name.first").to(function(value) {
      pn = value;
    }).now();

    bindable.set("person.name.first", "jake");
    expect(pn).to.be("jake");
    bindable.set("person.name", new BindableObject({ first: "josh" }));
    bindable.set("person.name.first", "jeff");
    expect(pn).to.be("jeff");
  })


  it("can be bound to a binding", function() {
    binding = bindable.bind("fish").now();
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

    bindable.set("name", "craig").bind("name").map(function(value) {
      return value.toUpperCase();
    }).to("name2").once().now();

    expect(bindable.get("name2")).to.be("CRAIG");
  });

  it("can perform multiple mappings", function() {
    var bindable = new BindableObject({
      name: "Craig"
    });

    bindable.bind("name").map(function(name) {
      return String(name).toLowerCase();
    }).to("nameLowerCase").
    map(function(name) {
      return String(name).toUpperCase()
    }).
    to("nameUpperCase").
    now();

    expect(bindable.get("nameLowerCase")).to.be("craig");
    expect(bindable.get("nameUpperCase")).to.be("CRAIG");
  });

  it("can form an undefined mapping", function() {
    var bindable = new BindableObject({
    });

    bindable.bind("name").map(function(name) {
      return name || "Craig";
    }).to("name2").now();

    expect(bindable.get("name2")).to.be("Craig");
  })


  it("can transform an object to and from", function() {
    var binding = bindable.set("name", "chris").bind("name").map({
      to: function(name) {
        return name.toUpperCase();
      },
      from: function(name) {
        return name.toLowerCase();
      }
    }).to("name2").bothWays().now();

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

    var changedLast, binding;

    bindable.set({
      name: subBindable
    });

    binding = bindable.bind("name.last", function(value) {
      changedLast = value;
    }).once();

    bindable.set("name.last", "jefferds");
    expect(changedLast).to.be("jefferds");
    expect(subBindable.get("last")).to.be("jefferds");
    binding.dispose()
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
  });

  it("can bind to a sub-binding 3", function() {
    var b1 = new BindableObject({
      name: {
        first: "craig"
      }
    });

    var b2 = new BindableObject({
      person: b1
    });

    var b3 = new BindableObject({
      person: b1
    });


    b3.bind("person.name.last", "lastName");
    b2.set("person", b1);
    b2.set("person.name.last", "bubu");


    expect(b3.get("lastName")).to.be("bubu");
  });
  


  it("can bind to a property where a bindable object is wrapping around another", function() {
    var bindable = new BindableObject(new BindableObject({
        name: "craig"
    }));


    var newName1, newName2;

    bindable.bind("name", function(value) {
      newName1 = value;
    });



    bindable.data.bind("name", function(value) {
      newName2 = value;
    });
    bindable.data.set("name", "jake");
    expect(newName1).to.be("jake");
    expect(newName2).to.be("jake");
  });

  
  it("bindings are disposed when an bindable is", function() {
    var bindable = new BindableObject({
      name: "craig"
    }),
    newName;

    bindable.bind("name", function(value) {
      newName = value;
    })

    //sanity
    bindable.set("name", "sam");
    expect(newName).to.be("sam");

    bindable.dispose();
    bindable.set("name", "liam");
    expect(newName).to.be("sam");
  });

  it("can set data without overriding the original data object", function() {
    var bindable = new BindableObject({
      name: "craig"
    });
    bindable.set("data", { name: "john" });
    bindable.set("data.last", "blarg");
    expect(bindable.get("name")).to.be("craig");
    expect(bindable.get("data.name")).to.be("john");
    bindable.set("data.name", "mike");
    expect(bindable.get("data.name")).to.be("mike");

  });

  it("can bind to an object", function() {
    var bindable = new BindableObject({
      name: "craig"
    }), name;

    bindable.bind({
      from: "name",
      to: [
        function(value) {
          name = value;
        },
        "someName"
      ]
    }).now();

    expect(bindable.get("someName")).to.be("craig");
    expect(name).to.be("craig");
  })


  it("can set null key and not fail", function() {
    bindable.set(null, 0);
  });

  it("can set a bindable object to a bindable object", function() {
    var bindable = new BindableObject(new BindableObject({ name: "craig" }));
    expect(bindable.getFlatten("name")).to.be("craig");
  });

  it("can get an object of a nested bindable object", function() {
    var bindable = new BindableObject(new BindableObject({ name: "craig" }));
    expect(bindable.getFlatten().name).to.be("craig");
  });


  it("can set 0 and not be undefined", function() {
    var bindable = new BindableObject({ count: 0 });
    expect(bindable.get("count")).not.to.be(undefined);
  });


  it("can pass the old value to the second param", function() {
    var bindable = new BindableObject({name:"craig"});

    var i = 0;
    bindable.bind("name").to(function(value, oldValue) {


      if(i++ == 0) {
        expect(value).to.be("craig");
        expect(oldValue).to.be(undefined);
      } else {
        expect(value).to.be("john");
        expect(oldValue).to.be("craig");
      }

    }).limit(2).now();

    bindable.set("name", "john");
  })


  it("can bind to a boolean value", function(next) {
    var bindable = new BindableObject({
      form: {
        isValid: false
      }
    })

    bindable.bind("form.isValid").to(function(value) {
      expect(value).to.be(false);
      next()
    }).now();

  });



  it("can bind to a computed property", function() {
    var bindable = new BindableObject({
      firstName: "Jake",
      lastName: "Anderson"
    });

    bindable.bind("firstName, lastName").
      map(function(firstName, lastName) {
        return [firstName, lastName].join(" ");
      }).to("fullName").now();

    expect(bindable.get("fullName")).to.be("Jake Anderson");
    bindable.set("firstName", "John");
    expect(bindable.get("fullName")).to.be("John Anderson");
  });


  it("can bind a computed property both ways", function() {
    var bindable = new BindableObject({
      firstName: "Jake",
      lastName: "Anderson"
    });

    bindable.bind("firstName, lastName").
      map({
        to: function(firstName, lastName) {
          return [firstName, lastName].join(" ");
        },
        from: function(fullName) {
          return fullName.split(" ");
        }
      }).to("fullName").bothWays().now();

    bindable.set("fullName", "John Doe");
    expect(bindable.get("firstName")).to.be("John");
    expect(bindable.get("lastName")).to.be("Doe");
  });


  it("can bind an undefined value the other way", function() {
    var bindable = new BindableObject({
      firstName: "Craig"
    });

    bindable.bind("firstName", "firstName2").bothWays().now();

    expect(bindable.get("firstName2")).to.be("Craig");

    //control
    bindable.set("firstName2", "John");
    expect(bindable.get("firstName")).to.be("John");
    bindable.set("firstName2", undefined);
    expect(bindable.get("firstName")).to.be(undefined);
  })



  it("value isn't undefined if get('') is calling from bindable obj", function() {
    var bindable = new BindableObject({});
    bindable.control = "hello";
    bindable.name = false;
    bindable.name2 = 0;
    expect(bindable.get("control")).to.be("hello");
    expect(bindable.get("name")).to.be(false);
    expect(bindable.get("name2")).to.be(0);
  })

});