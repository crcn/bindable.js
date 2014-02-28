var bindable = require(".."),
expect       = require("chai").expect;

describe("collection-test#", function () {
  // - bind length
  // - apis
  // - reset source
  // - emit insert, remove, update, reset



  it("can create a collection", function() {
    new bindable.Collection();
  });

  it("can initialize with a source", function (){
    var src = new bindable.Collection([0]);
    expect(src.at(0)).to.equal(0);
  });

  it("can return the source", function () {
    var src = new bindable.Collection([0]);
    expect(src.source()[0]).to.equal(0);
  })

  it("can push an item", function () {
    var src = new bindable.Collection();
    src.push(0);
    expect(src.at(0)).to.equal(0);
  });

  it("can unshift", function () {
    var src = new bindable.Collection();
    src.unshift(0);
    expect(src.at(0)).to.equal(0);
  });

  it("can remove", function () {
    var src = new bindable.Collection([0, 1]);
    src.remove(0);
    expect(src.at(0)).to.equal(1);
  });


  it("can won't remove if a value doesn't exist", function () {
    var src = new bindable.Collection([0, 1]);
    src.remove(99);
    expect(src.at(0)).to.equal(0);
    expect(src.at(1)).to.equal(1);
  });

  it("can replace an item", function () {
    var src = new bindable.Collection([0]);
    src.splice(0, 1, 1);
    expect(src.at(0)).to.equal(1);
  });

  it("can reset a source", function () {
    var src = new bindable.Collection([0]);
    src.reset([1]);
    expect(src.at(0)).to.equal(1);
    src.source([2]);
    expect(src.at(0)).to.equal(2);
  });

  it("it can reset the source with an undefined value", function () {
    var src = new bindable.Collection([0]);
    src.source(undefined);
    expect(src.length).to.equal(0);
  });

  it("returns the index of a value", function () {
    var src = new bindable.Collection([0, 1, 2]);
    expect(src.indexOf(1)).to.equal(1);
    expect(src.indexOf(99999)).to.equal(-1);
  });

  it("can filter a collection", function () {
    var src = new bindable.Collection([0, 1, 2, 3, 4]),
    filtered = src.filter(function(v) { return v % 2 });
    expect(filtered).to.contain(1);
    expect(filtered).not.to.contain(2);
    expect(filtered).to.contain(3);
    expect(filtered).not.to.contain(4);
  });

  it("can search for a value index", function () {
    var src = new bindable.Collection([{ name: "a" }]);
    expect(src.searchIndex({ name: "a" })).to.equal(0);
  });

  it("can search for a value", function () {
    var src = new bindable.Collection([{ name: "a" }]);
    expect(src.search({ name: "a" }).name).to.equal("a");
  });

  it("can call each value", function () {
    var src = new bindable.Collection([0, 1, 2, 3]), i = 0;
    src.each(function (v) {
      expect(i++).to.equal(v);
    });
  });

  it("can map values", function () {
    var src = new bindable.Collection([0, 1, 2, 3]);
    var src2 = src.map(function (v) {
      return v + 1;
    });
    expect(src2[0]).to.equal(1);
    expect(src2[1]).to.equal(2);
  });

  it("can join values", function () {
    var src = new bindable.Collection(["a", "b", "c"]);
    var src2 = src.join("+");
    expect(src2).to.equal("a+b+c")
  });

  it("can bind to the length of the collection", function () {
    var src = new bindable.Collection(), len;
    src.bind("length", function (value) {
      len = value;
    }).now();

    expect(len).to.equal(0);
    src.push(0);
    expect(len).to.equal(1);
  });

  it("can bind to the 'empty' property of a collection", function() {
    var src = new bindable.Collection(), empty;
    src.bind("empty", function (value) {
      empty = value;
    }).now();
    expect(empty).to.equal(true);
    src.push(0);
    expect(empty).to.equal(false);
  });

  it("can listen for an insert on push", function (next){
    var src = new bindable.Collection([1, 2, 3]);
    src.on("insert", function (v, i) {
      expect(v).to.equal(4);
      expect(i).to.equal(3);
      next();
    });
    src.push(4);
  });

  it("can listen for an insert on unshift", function (next){
    var src = new bindable.Collection([1, 2, 3]);
    src.on("insert", function (v, i) {
      expect(v).to.equal(4);
      expect(i).to.equal(0);
      next();
    });
    src.unshift(4);
  });

  it("can listen for an remove", function (next) {
    var src = new bindable.Collection([1, 2, 3]);
    src.on("remove", function (v, i) {
      expect(v).to.equal(2);
      expect(i).to.equal(1);
      next();
    });
    src.remove(2);
  });

  it("can listen for an reset", function (next) {
    var src = new bindable.Collection([99]);
    src.on("reset", function (v) {
      expect(v).to.contain(0);
      expect(v).to.contain(1);
      expect(v).to.contain(2);
      expect(v).not.to.contain(99);
      next();
    });
    src.reset([0, 1, 2]);
  });

  it("can listen for an replace", function () {

    var src = new bindable.Collection([99, 999]);
    
    src.on("reset", function (n, o, i) {
      expect(n).to.contain(8);
      expect(n).to.contain(9);
      expect(n).to.contain(10);
      expect(o).to.contain(99);
      expect(o).to.contain(999);
      expect(i).to.equal(0);
      expect(src.source()).to.contain(8);
      expect(src.source()).to.contain(9);
      expect(src.source()).to.contain(10);
      expect(src.source()).not.to.contain(99);
      expect(src.source()).not.to.contain(999);
      next();
    });
    src.splice(0, 2, [8, 9, 10]);
  });


  it("can pop an item", function () {
    var src = new bindable.Collection([0, 1]);
    expect(src.pop()).to.equal(1);
    expect(src.at(0)).to.equal(0);
  });


  it("can shift an item", function () {
    var src = new bindable.Collection([0, 1]);
    expect(src.shift()).to.equal(0);
    expect(src.at(0)).to.equal(1);
  });


  it("can bind to the first item in an array", function (){
    var src = new bindable.Collection([0, 1]), c = 0;
    src.bind("first", function (v) {
      c++;
      this.dispose();
      expect(v).to.equal(0);
    }).now();

    src.splice(0, 1, 2)

    src.bind("first", function (v) {
      c++;
      this.dispose();
      expect(v).to.equal(2);
    }).now();
    expect(c).to.equal(2);
  });

  it("can bind to the last item in an array", function (){
    var src = new bindable.Collection([0, 1]), c = 0;
    src.bind("last", function (v) {
      c++;
      this.dispose();
      expect(v).to.equal(1);
    }).now();

    src.splice(1, 1, 2)

    src.bind("last", function (v) {
      c++;
      this.dispose();
      expect(v).to.equal(2);
    }).now();
    expect(c).to.equal(2);
  });
});