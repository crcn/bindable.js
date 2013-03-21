var dref = require("../"),
expect = require("expect.js");

describe("dref", function() {


  var context = {
    city: {
      name: "San Francisco",
      zip: 94102
    },
    people: [
      {
        name: {
          first: "Craig"
        },
        hobbies: [{
          name: "fishing"
        },
        {
          name: "football"
        }]
      },
      {
        name: {
          first: "Sam"
        },
        hobbies: [{
          name: "cooking"
        }]
      },
      {
        name: {
          first: "Liam"
        }
      }
    ]
  }

  it("can fetch the city name", function() {
    expect(dref.get(context, "city.name")).to.be("San Francisco");
  });

  it("can set the city name", function() {
    dref.set(context, "city.name", "Minneapolis");
    expect(dref.get(context, "city.name")).to.be("Minneapolis");
  });

  it("deep ref doesn't exist", function() {
    expect(dref.get(context, "fsd.fsd.fd.fds.f.fs.fs.sfd")).to.be(undefined);
  });

  it("can fetch the people names", function() {
    expect(dref.get(context, "people.$.name.first")).to.contain("Craig", "Sam", "Liam");
  });

  it("can set the people company", function() {
    dref.set(context, "people.$.name.company", "Class Dojo");

    expect(dref.get(context, "people.$.name.company")).to.contain("Class Dojo");
    expect(dref.get(context, "people.$.name.company")).to.have.length(3);
  });


  it("can fetch hobbies", function() {
    expect(dref.get(context, "people.$.hobbies.$.name")).to.contain("fishing", "football", "cooking");
  })

});