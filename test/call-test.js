var expect = require("expect.js"),
bindable   = require("..");

describe("call#", function () {

  it("can call a function a bindable object", function (next) {
    var obj = new bindable.Object({
      hello: function () {
        next();
      }
    });

    obj.call("hello");
  });

  it("can pass arguments", function (next) {
    var obj = new bindable.Object({
      hello: function (abba) {
        expect(abba).to.be("abba");
        next();
      }
    });

    obj.call("hello", ["abba"]);
  });

  it("throws an error if the second parameter isn't an array", function (next) {

      var obj = new bindable.Object({
        hello: function (abba) {
        }
      });

      try {
        obj.call("hello", "abba");
      } catch(e) {
        expect(e.message).to.contain("must be an array");
        next();
      }
  });

  it("passes an error to the third param is provided", function (next) {

      var obj = new bindable.Object({
        hello: function (abba) {
        }
      });

      obj.call("hello", "abba", function (err) {
        expect(err.message).to.contain("must be an array");
        next();
      });
  });

  it("catches errors", function (next) {
    var obj = new bindable.Object({
      hello: function (abba) {
        throw new Error("fail")
      }
    });

    obj.call("hello", ["abba"], function (err) {
      expect(err.message).to.be("fail");
      next();
    });
  });

  it("returns a value in the second param of callback", function (next) {
    var obj = new bindable.Object({
      hello: function (abba) {
        return "success";
      }
    });

    obj.call("hello", ["abba"], function (err, result) {
      expect(result).to.be("success");
      next();
    });
  });

  it("waits for a function to exist before calling", function (next) {

    var obj = new bindable.Object({
    });

    obj.call("hello", ["abba"], function (err, result) {
      expect(result).to.be("success");
      next();
    });

    obj.set("hello", function () {
      return "success";
    });
  });

  it("only binds once to a function call", function (next) {

      var obj = new bindable.Object({
      });

      obj.call("hello", ["abba"], function (err, result) {
        expect(result).to.be("success");
        next();
      });

      obj.set("hello", function () {
        return "success";
      });

      obj.set("hello", function () {
        return "success";
      });
  });


  it("can call a function defined directly on the bindable object", function (next) {
    var obj = new bindable.Object({
    });

    obj.hello = function () {
      return "success";
    }

    obj.call("hello", ["abba"], function (err, result) {
      expect(result).to.be("success");
      next();
    });
  });
});
