var EventEmitter = require("..").EventEmitter,
expect = require("expect.js")

describe("event-emitter#", function () {

  it("can create an event emitter", function () {
    new EventEmitter().setMaxListeners();
  });

  it("throws an error if the listener is not a function", function () {
    try {
      new EventEmitter().on("event", {});
    } catch(e) {
      expect(e.message).to.contain("listener must be a function");
    }
  });

  it("throws an error on once if the listener is not a function", function () {
    var err;
    try {
      new EventEmitter().once("event", {});
    } catch(e) {
      err = e;
    }
    expect(err.message).to.contain("listener must be a function");
  });

  it("can emit to one listener", function (){
    var em = new EventEmitter(), emitted = 0;
    em.on("event", function () {
      emitted++;
    }); 
    em.emit("event");
    expect(emitted).to.be(1);
  });

  it("can emit to multiple listeners", function () {
    var em = new EventEmitter(), emitted = 0;
    em.on("event", function () {
      emitted++;
    }); 
    em.on("event", function () {
      emitted++;
    })
    em.emit("event");
    expect(emitted).to.be(2);
  });

  it("disposes a one-time listener after it's been triggered", function () {
    var em = new EventEmitter(), emitted = 0;
    em.once("event", function () {
      emitted++;
    });
    em.emit("event");
    em.emit("event");
    expect(emitted).to.be(1);
  });

  it("can emit many args", function () {
    var em = new EventEmitter();
    for(var i = 10; i--;) {
      em.once("event", function () {
        for (var j = i; j--;) {
          expect(arguments[i-j-1]).to.be(j);
        }
      });
      var args = ["event"];
      for (var j = i; j--;) {
        args.push(j);
      }
      em.emit.apply(em, args);
    }
  });

  it("can dispose an event listener multiple times without busting", function () {
    var em = new EventEmitter(), emitted = 0;
    var listener = em.on("event", function () {
      emitted++;
    });
    em.emit("event");
    listener.dispose();
    listener.dispose();
    em.emit("event");
    expect(emitted).to.be(1);
  });

  it("can dispose an event listener multiple times without busting 2", function () {
    var em = new EventEmitter(), emitted = 0;
    var listener = em.on("event", function () {
      emitted++;
    });
    var listener2 = em.on("event", function () {
      emitted++;
    });
    em.emit("event");
    listener.dispose();
    listener.dispose();
    listener2.dispose();
    listener2.dispose();
    em.emit("event");
    expect(emitted).to.be(2);
  });

  it("can remove all listeners of a type", function () {
    var em = new EventEmitter(), emitted = 0;
    em.on("event", function () {
      emitted++;
    });
    em.removeAllListeners("event");
    em.emit("event");
    expect(emitted).to.be(0);
  });

  it("can remove all listeners", function () {
    var em = new EventEmitter(), emitted = 0;
    em.on("event", function () {
      emitted++;
    });
    em.removeAllListeners();
    em.emit("event");
    expect(emitted).to.be(0);
  });
});