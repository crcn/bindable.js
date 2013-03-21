var dref = require("../"),
expect = require("expect.js")

function createModel(source) {

  var data = source || {};

  return {
    type: "model",
    get: function(key) {
      return dref.get(data, key);
    },
    set: function(key, value) {
      return dref.set(data, key, value);
    }
  }
}


function createArrayModel() {
  var src = Array.prototype.slice.call(arguments);
  var model = createModel(src);
  model.type = "array";
  model.length = function() {
    return src.length;
  }

  return model;
}

describe("models", function() {


  var context = {
    people: [
      createModel({
        name: "Craig",
        hobbies: createArrayModel(
          {
            name: "fishing"
          },
          {
            name: "football"
          }
        )
      }),
      createModel({
        name: "Sam",
        hobbies: createArrayModel(
          {
            name: "cooking"
          }
        )
      })
    ]
  };

  it("can use a plugin", function() {
    dref.use({
      test: function(item) {
        return item.type == "model";
      },
      get: function(context, key) {
        return context.get(key);
      },
      set: function(context, key, value) {
        context.set(key, value);
      }
    });
    dref.use({
      test: function(item) {
        return item.type == "array";
      },
      length: function(context) {
        return context.length();
      },
      get: function(context, key) {
        return context.get(key);
      },
      set: function(context, key, value) {
        context.set(key, value);
      }
    });
  });


  it("can fetch the first name", function() {
    expect(dref.get(context, "people.$.name")).to.contain("Craig", "Sam");
  });

  it("can set the first name", function() {
    dref.set(context, "people.$.name", "blah");
    expect(dref.get(context, "people.$.name")).to.contain("blah");
  });


  it("can fetch the hobby names", function() {
    expect(dref.get(context, "people.$.hobbies.$.name")).to.contain("fishing", "football", "cooking");
  })


  it("doesn't have a deep ref", function() {
    expect(dref.get(context, "people.$.hobbies.$.some.bad.path")).to.have.length(0);
  });



});