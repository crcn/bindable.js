"use strict";

var BindableObject = require("../object"),
computed           = require("../utils/computed"),
_                  = require("underscore");

/** 
 * @module mojo
 * @submodule mojo-core
 */

/**
 * @class BindableCollection
 * @extends BindableObject
 */

/**
 * Emitted when an item is inserted
 * @event insert
 * @param {Object} item inserted
 */


/**
 * Emitted when an item is removed
 * @event remove
 * @param {Object} item removed
 */

/**
 * Emitted when items are replaced
 * @event replace
 * @param {Array} newItems
 * @param {Array} oldItems
 */



function BindableCollection (source) {
  BindableObject.call(this, this);
  this.source = source || [];
  this._updateInfo();
  this.bind("source", _.bind(this._onSourceChange, this));
}

/**
 */

BindableObject.extend(BindableCollection, {

  /**
   */

  __isBindableCollection: true,

  /**
   */

  _onSourceChange: function (source) {
    if (!source) this.source = [];
    this._updateInfo();
    // this.emit("update", { insert: source, remove: this._currentSource })
    this.emit("reset", this._currentSource = source);
  },
  
  /**
   * Resets the collection. Same as `source(value)`.
   */

  reset: function (source) {
    return this.set("source", source);
  },

  /**
   * Returns the index of a value
   * @method indexOf
   * @param {Object} object to get index of
   * @returns {Number} index or -1 (not found)
   */

  indexOf: function (item) {
    return this.source.indexOf(item);
  },

  /**
   * filters the collection
   * @method filter
   * @returns {Array} array of filtered items
   */

  filter: function (fn) {
    return this.source.filter(fn);
  },

  /**
   * Returns an object at the given index
   * @method at
   * @returns {Object} Object at specific index
   */

  at: function (index) {
    return this.source[index];
  },

  /**
   * forEach item
   * @method each
   * @param {Function} fn function to call for each item
   */

  each: computed(["length"], function (fn) {
    this.source.forEach(fn);
  }),

  /**
   */

  map: function (fn) {
    return this.source.map(fn);
  },

  /**
   */

  join: function (sep) {
    return this.source.join(sep);
  },

  /**
   */

  slice: function () {
    return this.source.slice.apply(this.source, arguments);
  },

  /**
   * Pushes an item onto the collection
   * @method push
   * @param {Object} item
   */

  push: function () {
    var items = Array.prototype.slice.call(arguments);
    this.source.push.apply(this.source, items);
    this._updateInfo();

    // DEPRECATED
    this.emit("insert", items[0], this.length - 1);
    this.emit("update", { insert: items, index: this.length - 1});
  },

  /**
   * Unshifts an item onto the collection
   * @method unshift
   * @param {Object} item
   */

  unshift: function () {

    var items = Array.prototype.slice.call(arguments);
    this.source.unshift.apply(this.source, items);
    this._updateInfo();

    // DEPRECATED
    this.emit("insert", items[0], 0);
    this.emit("update", { insert: items });
  },

  /**
   * Removes N Number of items
   * @method splice
   * @param {Number} index start index
   * @param {Number} count number of items to remove
   */

  splice: function (index, count) {
    var newItems = Array.prototype.slice.call(arguments, 2),
    oldItems     = this.source.splice.apply(this.source, arguments);

    this._updateInfo();

    // DEPRECATED
    this.emit("replace", newItems, oldItems, index);
    this.emit("update", { insert: newItems, remove: oldItems });
  },

  /**
   * Removes an item from the collection
   * @method remove
   * @param {Object} item item to remove
   */

  remove: function (item) {
    var i = this.indexOf(item);
    if (!~i) return false;
    this.source.splice(i, 1);
    this._updateInfo();

    this.emit("remove", item, i);
    this.emit("update", { remove: [item] });
    return item;
  },

  /**
   * Removes an item from the end
   * @method pop
   * @returns {Object} removed item
   */

  pop: function () {
    if (!this.source.length) return;
    return this.remove(this.source[this.source.length - 1]);
  },

  /**
   * Removes an item from the beginning
   * @method shift
   * @returns {Object} removed item
   */

  shift: function () {
    if (!this.source.length) return;
    return this.remove(this.source[0]);
  },

  /*
   */

  toJSON: function () {
    return this.source.map(function (item) {
      return item && item.toJSON ? item.toJSON() : item;
    });
  },

  /*
   */

  _updateInfo: function () {
    this.setProperties({
      first  : this.source.length ? this.source[0] : void 0,
      length : this.source.length,
      empty  : !this.source.length,
      last   : this.source.length ? this.source[this.source.length - 1] : void 0
    });
  }
});

module.exports = BindableCollection;
