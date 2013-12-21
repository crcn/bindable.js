var protoclass = require("protoclass"),
disposable     = require("disposable");

function EventEmitter () {
  this._events = {};
}

EventEmitter.prototype.setMaxListeners = function () {

}

EventEmitter.prototype.on = function (event, listener) {

  if (arguments.length === 1) {
    var disposables = disposable.create(),
    listeners = event;
    for(var key in listeners) {
      disposables.add(this.on(event, listeners[key]));
    }
    return disposables;
  }

  if (~event.indexOf(" ")) {
    var keys = event.split(" "),
    disposables = disposable.create();

    for (var i = keys.length; i--;) {
      disposables.add(this.on(keys[i], listener));
    }
    return disposables;
  }

  if (typeof listener !== "function") {
    throw new Error("listener must be a function for event '"+event+"'");
  }

  var listeners;
  if (!(listeners = this._events[event])) {
    this._events[event] = listener;
  } else if (typeof listeners === "function") {
    this._events[event] = [listeners, listener];
  } else {
    listeners.push(listener);
  }

  var self = this;

  return {
    dispose: function() {
      self.off(event, listener);
    }
  }
}

EventEmitter.prototype.off = function (event, listener) {

  var listeners;

  if(!(listeners = this._events[event])) {
    return;
  }

  if (typeof listeners === "function") {
    this._events[event] = null;
  } else {
    var i = listeners.indexOf(listener);
    if (~i) listeners.splice(i, 1);
  }

}

EventEmitter.prototype.once = function (event, listener) {

  function listener2 () {
    disp.dispose();
    listener.apply(this, arguments);
  }

  var disp = this.on(event, listener2);  
  disp.target = this;
  return disp;
}

EventEmitter.prototype.emit = function (event) {



  if (!this._events[event]) return;


  var listeners = this._events[event];



  if (typeof listeners === "function") {
    if (arguments.length === 1) {
      listeners();
    } else {
    switch(arguments.length) {
      case 2:
        listeners(arguments[1]);
        break;
      case 3:
        listeners(arguments[1], arguments[2]);
        break;
      case 4:
        listeners(arguments[1], arguments[2], arguments[3]);
        break;
      default:
        var n = arguments.length;
        var args = new Array(n - 1);
        for(var i = 1; i < n; i++) args[i-1] = arguments[i];
        listeners.apply(this, args);
    }
  }
  } else {
    var n = arguments.length;
    var args = new Array(n - 1);
    for(var i = 1; i < n; i++) args[i-1] = arguments[i];
    for(var j = listeners.length; j--;) {
      if(listeners[j]) listeners[j].apply(this, args);
    }
  }
}


EventEmitter.prototype.removeAllListeners = function (event) {
  this._events[event] = null;
}



module.exports = EventEmitter;