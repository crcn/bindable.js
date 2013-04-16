var Collection = require("../").Collection,
expect = require("expect.js"),
_ = require("underscore");

describe("bindable collection", function() {
  
  var col1 = new Collection([
    {
      lname: "Craig"
    },
    {
      lname: "Sam"
    },
    {
      lname: "Liam"
    }
  ], "lname"),
  col2     = new Collection([
    {
      name: "Chris"
    },
    {
      name: "Frank"
    }
  ], "name"),
  col3 = new Collection("lname"),
  col4 = new Collection("lname"),
  col5 = new Collection("lname"),
  bindings = {};



  it("can bind a col1 -> col3", function() {
    bindings.col13 = col1.bind().to(col3);
  });

  it("col3 has the same items as col1", function() {
    expect(_.intersection(col1.source(), col3.source()).length).to.be(3);
  });

  it("col1 can remove 'Craig'", function() {
    col1.remove({ lname: "Craig" })
  });

  it("col1 doesn't have 'Craig' anymore", function() {
    expect(col1.indexOf({ lname: "Craig" })).to.be(-1);
  });

  it("col3 doesn't have 'Craig' anymore", function() {
    expect(col3.indexOf({ lname: "Craig" })).to.be(-1);
  });

  it("col1 can insert 'Claudia'", function() {
    col1.push({ lname: "Claudia" });
  });

  it("col3 has 'Claudia'", function() {
    expect(col3.indexOf({ lname: "Claudia"})).to.be(2);
  });

  it("can bind & transform from col1 -> col2", function() {
    bindings.col12 = col1.bind().transform({
      to: function(item) {
        return {
          name: item.lname
        }
      }
    }).to(col2);
  });


  it("col2 has all the transformed people", function() {
    expect(col2.filter(function(item) {
      return item.name.match(/Sam|Liam|Claudia/)
    }).length).to.be(3)
  });

  it("col1 can remove 'Sam'", function() {
    col1.remove({ lname: "Sam" });
  });

  it("col2 doesn't have Sam anymore", function() {
    expect(col2.indexOf({ name: "Sam" })).to.be(-1);
  });


  it("can dispose a binding", function() {
    bindings.col12.dispose();
  });


  it("can insert an item into col1 without effecting col2", function() {
    col1.push({ lname: "Monica" });
  });

  it("col2 doesn't have Monica", function() {
    expect(col2.indexOf({ name: "Monica" })).to.be(-1);
  });

  it("a binding with a filter can be created", function() {
    bindings.col12 = col1.bind().filter({ lname: { $ne: "Monica" }}).transform(function(person) {
      return { name: person.lname }
    }).to(col2);
  });

  it("col2 still doesn't have Monica", function() {
    expect(col2.indexOf({ name: "Monica" })).to.be(-1);
    bindings.col12.dispose();
  });

  //sanity
  it("a binding can be created without a filter", function() {
    bindings.col12 = col1.bind().transform(function(person) {
      return { name: person.lname }
    }).to(col2);
  });

  it("col2 has Monica", function() {
    expect(col2.indexOf({ name: "Monica" })).not.to.be(-1);
    bindings.col12.dispose();
  });


  it("can bind to multiple collections", function() {
    bindings.col345 = col1.bind().to(col4).to(col5);
  });


  it("has bound to multiple collections", function() {

    //still bound from above

    ["Liam", "Claudia", "Monica"].forEach(function(name) {
      [col3, col4, col5].forEach(function(col) {
        expect(col.indexOf({ lname: name })).not.to.be(-1);
      })
    })
    bindings.col345.dispose();
  });


  it("isn't bound to multiple collections anymore", function() {
    col1.push({ lname: "Matt" });
    expect(col4.source()).not.to.contain("Matt")
    expect(col5.source()).not.to.contain("Matt")
  });


  it("can bind from a reset", function() {
    col3.reset(col1);
    col1.push({ lname: "Jake" });
  });

  it("col3 should contain Jake", function() {
    expect(col3.indexOf({ lname: "Jake" })).not.to.be(-1);
  });


  it("can bind to the collection length", function() {
    var newLength;
    var binding = col1.bind("length", function(value) {
      newLength = value;
    })
    col1.push({ lname: "abbba" });
    expect(newLength).to.be(col1.length());
    binding.dispose();
  });


  it("can transform objects", function() {
    col3.reset([]);
    col3._id("name");
    col3.transform().map(function(value){ return { name: value }});
    col3.push("John");
  });

  it("has transformed john", function() {
    expect(col3.indexOf({ name: "John" })).to.be(0);
  });


  it("can be JSON encoded", function() {
    var data = JSON.parse(JSON.stringify(col1));
    for(var i = data.length; i--;) {
      var item = data[i];
      expect(_.keys(item).length).to.be(1);
      expect(item.lname).not.to.be(undefined);
    }
  });

});