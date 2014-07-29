var bindable = require(".."),
expect       = require("expect.js");

describe("pause-resume#", function () {

  before(function () {
    bindable.options.computedDelay = -1;
  });

  after(function () {
    bindable.options.computedDelay = 0;
  })


  it("can pause & resume a simple binding, and resume it", function () {
    var o = new bindable.Object({ name: "abba" }), i = 0;
    var binding = o.bind("name", function (ab) {
      i++;
    }).now();

    expect(i).to.be(1);
    binding.pause();
    binding.now();
    expect(i).to.be(1);
    binding.resume();
    binding.now();
    expect(i).to.be(2);
  });

  it("can pause & resume multiple bindings", function () {
    var o = new bindable.Object({ firstName: "a", lastName: "b" }), i = 0;

    var binding = o.bind("firstName, lastName", function () {
      i++;
    }).now();

    expect(i).to.be(2);
    binding.pause();
    binding.now();
    expect(i).to.be(2);
    binding.resume();
    binding.now();
    expect(i).to.be(4);
  });

  it("can pause & resume a chained property", function () {


    var o = new bindable.Object({ 
      friends: new bindable.Collection([
        new bindable.Object({ name: "a" }),
        new bindable.Object({ name: "b" })
      ])
    });

    var i = 0;

    var binding = o.bind("friends.@each.name", function (names) {
      i++;
    }).now();

    expect(i).to.be(1);
    binding.pause();
    binding.now();
    expect(i).to.be(1);
    binding.resume();
    binding.now();
    expect(i).to.be(2);
  });

  it("doesn't re-trigger a transformed listener", function () {
    var o = new bindable.Object({ name: "abba" }), i = 0;
    var binding = o.bind("name", { to: function (ab) {
      i++;
    }}).now();

    expect(i).to.be(1);
    binding.pause();
    binding.now();
    expect(i).to.be(1);
    binding.resume();
    binding.now();
    expect(i).to.be(1);
    o.set("name", "baab");
    expect(i).to.be(2);
    binding.pause();
    o.set("name", "abba");
    binding.resume();
    binding.now();
    expect(i).to.be(3);

  });
});