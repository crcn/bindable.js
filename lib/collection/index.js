var BindableObject = require("../object"),
computed           = require("../utils/computed"),
sift               = require("sift");

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
  this._source = source || [];
  this._updateInfo();
}

/**
 */

BindableObject.extend(BindableCollection, {

  /**
   */

  __isBindableCollection: true,
  
  /**
   * Resets the collection. Same as `source(value)`.
   */

  reset: function (source) {
    return this.source(source);
  },

  /**
   * Sets / Gets source array
   * @method source
   * @param {Array} source source of the collection
   * @returns [Array] source
   */

  source: function (source) {

    if (!arguments.length) return this._source;
    var oldSource = this._source || [];
    this._source = source || [];
    this._updateInfo();

    this.emit("reset", this._source);
  },

  /**
   * Returns the index of a value
   * @method indexOf
   * @param {Object} object to get index of
   * @returns {Number} index or -1 (not found)
   */

  indexOf: function (item) {
    return this._source.indexOf(item);
  },

  /**
   * filters the collection
   * @method filter
   * @returns {Array} array of filtered items
   */

  filter: function (fn) {
    return this._source.filter(fn);
  },

  /**
   */

  search: function (query) {
    return sift(query, this._source).shift();
  },

  /**
   */

  searchIndex: function (query) {
    return this.indexOf(this.search(query));
  },

  /**
   * Returns an object at the given index
   * @method at
   * @returns {Object} Object at specific index
   */

  at: function (index) {
    return this._source[index];
  },

  /**
   * forEach item
   * @method each
   * @param {Function} fn function to call for each item
   */

  each: computed(["length"], function (fn) {
    this._source.forEach(fn);
  }),

  /**
   */

  map: function (fn) {
    return this._source.map(fn);
  },

  /**
   */

  join: function (sep) {
    return this._source.join(sep);
  },

  /**
   * Pushes an item onto the collection
   * @method push
   * @param {Object} item
   */

  push: function (item) {
    this._source.push(item);
    this._updateInfo();
    this.emit("insert", item, this._source.length - 1);
  },

  /**
   * Unshifts an item onto the collection
   * @method unshift
   * @param {Object} item
   */

  unshift: function (item) {
    this._source.push(item);
    this._updateInfo();
    this.emit("insert", item, 0);
  },

  /**
   * Removes N Number of items
   * @method splice
   * @param {Number} index start index
   * @param {Number} count number of items to remove
   */

  splice: function (index, count) {
    var newItems = Array.prototype.slice.call(arguments, 2),
    oldItems     = this._source.splice.apply(this._source, arguments);

    this._updateInfo();
    this.emit("replace", newItems, oldItems, index);
  },

  /**
   * Removes an item from the collection
   * @method remove
   * @param {Object} item item to remove
   */

  remove: function (item) {
    var i = this.indexOf(item);
    if (!~i) return false;
    this._source.splice(i, 1);
    this._updateInfo();
    this.emit("remove", item, i);
    return item;
  },

  /**
   * Removes an item from the end
   * @method pop
   * @returns {Object} removed item
   */

  pop: function () {
    if (!this._source.length) return;
    return this.remove(this._source[this._source.length - 1]);
  },

  /**
   * Removes an item from the beginning
   * @method shift
   * @returns {Object} removed item
   */

  shift: function () {
    if (!this._source.length) return;
    return this.remove(this._source[0]);
  },

  /*
   */

  toJSON: function () {
    return this._source.map(function (item) {
      return item && item.toJSON ? item.toJSON() : item;
    })
  },

  /*
   */

  _updateInfo: function () {

    /**
     * First item in the collection
     * @property first
     * @type Object
     */

    this.set("first", this._source.length ? this._source[0] : undefined);


    /**
     * length of the collection
     * @property length
     * @type Number
     */

    this.set("length", this._source.length);


    /**
     * True of the collection is empty
     * @property empty
     * @type Boolean
     */

    this.set("empty", !this._source.length);

    /**
     * Last item in the collection
     * @property last
     * @type Object
     */

    this.set("last", this._source.length ? this._source[this._source.length - 1] : undefined);
  }
});

module.exports = BindableCollection;
