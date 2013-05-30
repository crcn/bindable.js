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

    bindable.set("name", "craig").bind("name").transform(function(value) {
      return value.toUpperCase();
    }).to("name2").once().now();

    expect(bindable.get("name2")).to.be("CRAIG");
  });


  it("can transform an object to and from", function() {
    var binding = bindable.set("name", "chris").bind("name").transform({
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


  /*it("can set a sub-bindable value", function() {
    var bindable = new BindableObject({
      view: new BindableObject({
        student: new BindableObject({
          name: "craig"
        })
      })
    });
    expect(bindable.get("view.student.name")).to.be("craig");
    bindable.set("view.student.name", "blah");
    console.log(bindable.get("view.student.name"))
  });*/

  /*
  not anymore!
  it("should be able to bind to a single property", function() {
    var person = new BindableObject({
      
    });

    person.name = { first: "craig" }
    var p = {};

    person.bind("name", function(value) {
      p = value;
    })

    expect(p.first).to.be("craig");

    person.set("name", { first: "jake" });
    expect(person.name.first).to.be("jake");
    expect(p.first).to.be("jake");
  })*/

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

  /*
  not anymore!
  it("can bind to a regular property", function() {
    var b1 = new BindableObject({

    });

    b1.sub = new BindableObject({
      name: "craig"
    });

    b1.set("sub.name", "john");
    expect(b1.sub.get("name")).to.be("john");
  })
*/

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

});