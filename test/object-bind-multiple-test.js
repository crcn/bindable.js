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
});
