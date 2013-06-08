var bindable = require(".."),
expect = require("expect.js");

describe("function call", function() {

  var craig = new bindable.Object({
    name: {
      first: "craig",
      last: "c"
    }
  });

  var tim = new bindable.Object({
    name: {
      first: "tim",
      last: "e"
    }
  })

  var sam = new bindable.Object({
    name: {
      first: "sam",
      last: "C"
    }
  });


  var liam = new bindable.Object({
    name: {
      first: "liam",
      last: "d"
    },
    friends: [
      craig,
      tim,
      sam
    ]
  });

  
  it("can filter out all users with a middle name", function() {
    var binding = liam.bind("@friends.name.middle").map(function(middleNames) {
      return liam.get("friends").filter(function(friend) {
        return !!friend.get("name.middle");
      })
    }).to("friendsWithMiddleNames").now();

    expect(liam.get("friendsWithMiddleNames").length).to.be(0);
    craig.set("name.middle", "j");
    expect(liam.get("friendsWithMiddleNames").length).to.be(1);
    sam.set("name.middle", "j");
    expect(liam.get("friendsWithMiddleNames").length).to.be(2);
    sam.set("name.middle", undefined);
    expect(liam.get("friendsWithMiddleNames").length).to.be(1);

    binding.dispose()
  });


  it("can call forEach on an array", function() {
    liam.bind("friends.@forEach.name.middle").map(function(middleNames) {
      return liam.get("friends").filter(function(friend) {
        return !!friend.get("name.middle");
      })
    }).to("friendsWithMiddleNames2").now();

    expect(liam.get("friendsWithMiddleNames2").length).to.be(1);
    sam.set("name.middle", "j");
    expect(liam.get("friendsWithMiddleNames2").length).to.be(2);
    sam.set("name.middle", undefined);
    expect(liam.get("friendsWithMiddleNames2").length).to.be(1);
  });

  function resetMiddleNames() {
    var friends = liam.get("friends");

    for(var i = friends.length; i--;)
        friends[i].set("name.middle", undefined)

  }


  it("can call .each() on a collection", function() {
    resetMiddleNames();

    var col = new bindable.Collection(liam.get("friends"), "name.first");

    var binding = col.bind("@each.name.middle").map(function(middleNames) {
      return col.filter(function(friend) {
        return !!friend.get("name.middle");
      })
    }).to("friendsWithMiddleNames").now();

    
    expect(col.get("friendsWithMiddleNames").length).to.be(0);
    craig.set("name.middle", "j");
    expect(col.get("friendsWithMiddleNames").length).to.be(1);
    sam.set("name.middle", "j");
    expect(col.get("friendsWithMiddleNames").length).to.be(2);
    sam.set("name.middle", undefined);
    expect(col.get("friendsWithMiddleNames").length).to.be(1);

    binding.dispose();
  });


  it("can update friendsWithMiddleNames once a person has been added", function() {
    resetMiddleNames();
    var monica = new bindable.Object({
      name: {
        first: "Monica"
      }
    });
    var col = new bindable.Collection(liam.get("friends"), "name.first");
    var binding = col.bind("@each.name.middle").map(function(middleNames) {
      return col.filter(function(friend) {
        return !!friend.get("name.middle");
      })
    }).to("friendsWithMiddleNames").now();

    col.push(monica);

    expect(col.get("friendsWithMiddleNames").length).to.be(0);
    craig.set("name.middle", "j");
    expect(col.get("friendsWithMiddleNames").length).to.be(1);
    monica.set("name.middle", "h");
    expect(col.get("friendsWithMiddleNames").length).to.be(2);

    col.remove(craig);
    expect(col.get("friendsWithMiddleNames").length).to.be(1);

    //sanity
    col.push(craig);
    expect(col.get("friendsWithMiddleNames").length).to.be(2);

    col.push(monica);
  });

});