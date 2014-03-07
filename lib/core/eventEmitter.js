var protoclass = require("protoclass");

/** 
 * @module mojo
 * @submodule mojo-core
 */

/**
 * @class EventEmitter
 */

function EventEmitter () {
  this._events = {};
}

EventEmitter.prototype.setMaxListeners = function () {

}

/**
 * adds a listener on the event emitter
 *
 * @method on
 * @param {String} event event to listen on
 * @param {Function} listener to callback when `event` is emitted.
 * @returns {Disposable}
 */


EventEmitter.prototype.on = function (event, listener) {

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

/**
 * removes an event emitter
 * @method off
 * @param {String} event to remove
 * @param {Function} listener to remove
 */

EventEmitter.prototype.off = function (event, listener) {

  var listeners;

  if(!(listeners = this._events[event])) {
    return;
  }

  if (typeof listeners === "function") {
    this._events[event] = undefined;
  } else {
    var i = listeners.indexOf(listener);
    if (~i) listeners.splice(i, 1);
    if (!listeners.length) {
      this._events[event] = undefined;
    }
  }
}

/**
 * adds a listener on the event emitter
 * @method once
 * @param {String} event event to listen on
 * @param {Function} listener to callback when `event` is emitted.
 * @returns {Disposable}
 */


EventEmitter.prototype.once = function (event, listener) {

  function listener2 () {
    disp.dispose();
    listener.apply(this, arguments);
  }

  var disp = this.on(event, listener2);  
  disp.target = this;
  return disp;
}

/**
 * emits an event
 * @method emit
 * @param {String} event
 * @param {String}, `data...` data to emit
 */


EventEmitter.prototype.emit = function (event) {

  if (this._events[event] === undefined) return;

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

/**
 * removes all listeners
 * @method removeAllListeners
 * @param {String} event (optional) removes all listeners of `event`. Omitting will remove everything.
 */


EventEmitter.prototype.removeAllListeners = function (event) {
  if (arguments.length === 1) {
    this._events[event] = undefined;
  } else {
    this._events = {};
  }
}



module.exports = EventEmitter;