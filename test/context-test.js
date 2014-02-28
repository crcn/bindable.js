var expect = require("chai").expect,
bindable = require("..");


describe("context-test#", function () {

  describe("single property", function () {
    it("can reference the binding when a function is called", function () {
      var obj = new bindable.Object({ name: "a" });
      obj.bind("name", function () {
        expect(this.target).to.equal(obj);
      }).now();
    });
  });

  describe("chained property", function () {
    it("can reference the binding when a function is called", function () {
      var obj = new bindable.Object({ "a.b.c.d": "e" });
      obj.bind("a.b.c.d", function () {
        expect(this.target).to.equal(obj);
      }).now();
    });
  });

  describe("computed property", function () {
    // TODO
  })

  describe("transformed listener", function () {
    it("can reference the binding when a function is called", function () {
      var obj = new bindable.Object({ "a.b.c.d": "e" });
      obj.bind("a.b.c.d", { to: function () {
        expect(this.target).to.equal(obj);
      }}).now();
    })
  });
})