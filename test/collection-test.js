var Collection = require("../").Collection,
expect = require("expect.js");

describe("bindable collection", function() {

  var col1 = new Collection(["Craig", "Sam", "Liam"]),
  col2     = new Collection([
    {
      name: "Chris"
    },
    {
      name: "Frank"
    }
  ])._id("name"),
  col3 = new Collection(),
  col4 = new Collection(),
  col5 = new Collection(),
  bindings = {};



  it("can bind a col1 -> col3", function() {
    bindings.col13 = col1.bind().to(col3);
  });

  it("col3 has the same items as col1", function() {
    expect(col3.source()).to.contain("Craig", "Sam", "Liam")
  });

  it("col1 can remove 'Craig'", function() {
    col1.remove("Craig")
  });

  it("col1 doesn't have 'Craig' anymore", function() {
    expect(col1.source()).not.to.contain("Craig")
  });

  it("col3 doesn't have 'Craig' anymore", function() {
    expect(col3.source()).not.to.contain("Craig");
  });

  it("col1 can insert 'Claudia'", function() {
    col1.push("Claudia");
  });

  it("col3 has 'Claudia'", function() {
    expect(col3.source()).to.contain("Claudia");
  });

  it("can bind & transform from col1 -> col2", function() {
    bindings.col12 = col1.bind().transform({
      to: function(item) {
        return {
          name: item
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
    col1.remove("Sam");
  });

  it("col2 doesn't have Sam anymore", function() {
    expect(col2.indexOf({ name: "Sam" })).to.be(-1);
  });


  it("can dispose a binding", function() {
    bindings.col12.dispose();
  });


  it("can insert an item into col1 without effecting col2", function() {
    col1.push("Monica");
  });

  it("col2 doesn't have Monica", function() {
    expect(col2.indexOf({ name: "Monica" })).to.be(-1);
  });

  it("a binding with a filter can be created", function() {
    bindings.col12 = col1.bind().filter({ $ne: "Monica" }).transform(function(name) {
      return { name: name }
    }).to(col2);
  });

  it("col2 still doesn't have Monica", function() {
    expect(col2.indexOf({ name: "Monica" })).to.be(-1);
    bindings.col12.dispose();
  });

  //sanity
  it("a binding can be created without a filter", function() {
    bindings.col12 = col1.bind().transform(function(name) {
      return { name: name }
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
    expect(col3.source()).to.contain("Liam", "Claudia", "Monica")
    expect(col4.source()).to.contain("Liam", "Claudia", "Monica")
    expect(col5.source()).to.contain("Liam", "Claudia", "Monica")
    bindings.col345.dispose();
  });


  it("isn't bound to multiple collections anymore", function() {
    col1.push("Matt");
    expect(col4.source()).not.to.contain("Matt")
    expect(col5.source()).not.to.contain("Matt")
  });


});