var bindable = require(".."),
expect       = require("expect.js");

describe("object-computed#", function () {


  // emit watching
  it("can bind to a computed property", function (next) {
    var friends = [{ name: "sam" }, { name: "liam" }];
    var obj = new bindable.Object({
      friends: friends
    });

    obj.bind("friends.@forEach", function (people) {
      expect(people[0].get("name")).to.be("sam");
      expect(people[1].get("name")).to.be("liam");
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

  it("can explicitly define what properties to watch on a function", function (next) {
    var friends  = [{ name: "sam" }, { name: "monica"}, { name: "tim" } ];
    var obj = new bindable.Object(), calls = 0;
    //obj.context(obj);
    obj.friends = friends;
    obj.eachFriend = bindable.computed(["friends"], function (fn) {
      friends.forEach(fn);
    });

    obj.bind("@eachFriend.name", function (names) {
      expect(names).not.to.contain(friends);
      expect(names).to.contain(friends[0].name);
      expect(names).to.contain(friends[1].name);
      expect(names).to.contain(friends[2].name);
      if (calls++ === 1) {
        next();
      }
    }).now();

    obj.set("friends", friends = [ {name:"a"}, { name: "b"}, { name: "c"} ]);
  });

  it("always returns an array", function () {
    var obj = new bindable.Object({});
    obj.bind("a.@each.name", function (value) {
      expect(value).not.to.be(undefined);
      expect(value.length).to.be(0);
    }).now()
  });

  it("does not return the context of a value that is a bindable object if watched", function () {
    var friend;
    var obj = new bindable.Object({ a: {friends: [{ name: "sam" }, { name: "monica"}, { name: "tim" } ].map(function(v) { return new bindable.Object(v); }) } });
    obj.bind("a.friends.@forEach", function (friends) {
      friends.forEach(function (friend) {
        expect(friend).not.to.be(undefined);
      });
    }).now();
  })
});