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
  ]),
  col3     = new Collection();



  it("can bind a col1 -> col3", function() {
    col1.bind().to(col3);
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
    col1.bind().transform({
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
  })
});