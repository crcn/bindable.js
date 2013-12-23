var bindable = require(".."),
expect       = require("expect.js");

describe("object-computed#", function () {


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

  it("can bind to a computed property property", function (next) {
    var friends = [{ name: "sam" }, { name: "liam" }];
    var obj = new bindable.Object({
      friends: friends
    });

    obj.bind("friends.@forEach.name", function (people) {
      expect(people[0]).to.be("sam");
      expect(people[1]).to.be("liam");
      next();
    }).now();
  });

  it("can bind to a sub-computed property", function (next) {
    var friends = [{ name: "sam", tags: [{ value: "a" }, { value: "b" }] }, { name: "liam", tags: [{ value: "c" }] }];
    var obj = new bindable.Object({
      friends: friends
    });

    obj.bind("friends.@forEach.tags.@forEach.value", function (tags) {
      expect(tags[0]).to.be("a");
      expect(tags[1]).to.be("b");
      expect(tags[2]).to.be("c");
      next();
    }).now();
  });

});