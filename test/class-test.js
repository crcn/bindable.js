var Bindable = require("../"),
structr = require("structr"),
expect = require("expect.js");

describe("class binding", function() {



  var Bindable2 = structr(Bindable, {
    name: "craig",
    name2: Bindable.from("name"),
    age: Bindable.from("age2"),
    age2: 99
  }), bindable;



  it("can create bindable2", function() {
    bindable = new Bindable2();
  });

  it("name2 is craig", function() {
    expect(bindable.get("name2")).to.be("craig");
  });

  it("age is 99", function() {
    expect(bindable.get("age")).to.be(99);
  });
})