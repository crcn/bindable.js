var bindable = require(".."),
expect       = require("chai").expect;

describe("object-multiple#", function () {


  // emit watching
  it("can bind to multiple properties", function (next) {
    var person = new bindable.Object({ firstName: "A", lastName: "B" });
    person.bind("firstName, lastName", function (firstName, lastName) {
      expect(firstName).to.equal("A");
      expect(lastName).to.equal("B");
      next();
    }).now();
  });


  it("delays listener if both values change immediately", function (next) {
    var person = new bindable.Object();
    person.bind("firstName, lastName", function(firstName, lastName) {
      expect(firstName).to.equal("A");
      expect(lastName).to.equal("B");
      next();
    });
    person.setProperties({
      firstName: "A",
      lastName: "B"
    })
  })
});
