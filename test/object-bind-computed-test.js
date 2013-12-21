var bindable = require(".."),
expect       = require("expect.js");

describe("object-basic#", function () {


  it("can bind to a computed property", function (next) {
    var friends = [{ name: "sam" }, { name: "liam" }];
    var obj = new bindable.Object({
      friends: friends
    });

    obj.bind("friends.@forEach", function (people) {
      expect(people[0].name).to.be("sam");
      expect(people[1].name).to.be("liam");
      next();
    }).now();
  });
});