var bindable = require(".."),
expect       = require("expect.js");

describe("object-multiple#", function () {


  it("can bind to multiple properties", function (next) {
    var person = new bindable.Object({ firstName: "A", lastName: "B" });
    person.bind("firstName, lastName", function (firstName, lastName) {
      expect(firstName).to.be("A");
      expect(lastName).to.be("B");
      next();
    }).now();
  });


  it("delays listener if both values change immediately", function (next) {
    var person = new bindable.Object();
    person.bind("firstName, lastName", function(firstName, lastName) {
      expect(firstName).to.be("A");
      expect(lastName).to.be("B");
      next();
    });
    person.setProperties({
      firstName: "A",
      lastName: "B"
    })
  })
});
