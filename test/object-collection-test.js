var BindableCollection = require("../").Collection,
BindableObject = require("../").Object,
expect = require("expect.js");

describe("bindable object collection", function() {
  
  
  var col1 = new BindableCollection([
    {
      lname: "Craig"
    },
    {
      lname: "Sam"
    },
    {
      lname: "Liam"
    }
  ], "lname"),
  col2 = new BindableCollection([
    {
      name: "craig"
    },
    {
      name: "josh"
    },
    {
      name: "jake"
    }
  ], "name"),
  col3 = new BindableCollection(),
  bindable = new BindableObject({
    "source": col1
  })


  var pneg = new BindableCollection([
    {
      name: "Positive 1",
      value: 1
    },
    {
      name: "Positive 2",
      value: 1
    },
    {
      name: "Negative 1",
      value: -1
    },
    {
      name: "Negative 2",
      value: -1
    }
  ], "name");

  col2.oid = "col2"
  col3.oid = "col3"
  col1.oid = "col1";


  it("can cast an object binding to a collection binding", function() {

    var b = bindable.bind("source").collection().to(col3).now();

    for(var i = col1.length(); i--;) {
      expect(col3.indexOf(col1.at(i))).to.be(i);
    }

    b.dispose()

  });


  it("binding to col3 doesn't exist anymore", function() {
    var n = col3.length();
    col1.push({ lname: "blah" });
    expect(col3.length()).to.be(n);
  })

  it("can change the source & be reflected in the target collection", function() {
      
    var binding = bindable.bind("source").collection().to(col3).now();

    for(var i = col1.length(); i--;) {
      expect(col3.indexOf(col1.at(i))).to.be(i);
    }

    bindable.set("source", col2);

    for(var i = col2.length(); i--;) {
      expect(col3.indexOf(col2.at(i))).to.be(i);
    }


    binding.dispose();
  });


  it("binding to source doesn't work anymore", function() {
    bindable.set("source", col1);
    for(var i = col2.length(); i--;) {
      expect(col3.indexOf(col2.at(i))).to.be(i);
    }
  });





});