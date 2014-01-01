var bindable = require(".."),
expect       = require("expect.js");

describe("collection-test#", function () {
  // - bind length
  // - apis
  // - reset source
  // - emit insert, remove, update, reset
  // - bind length
  // - re-compute when values change

  it("can create a collection", function() {
    new bindable.Collection();
  });
});