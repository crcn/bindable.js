var BindableObject = require("../object"),
computed           = require("../utils/computed"),
sift               = require("sift");

/**
 */

function BindableCollection(source) {
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
   */

  reset: function (source) {
    return this.source(source);
  },

  /**
   */

  source: function (source) {

    if (!arguments.length) return this._source;
    var oldSource = this._source || [];
    this._source = source || [];
    this._updateInfo();

    this.emit("reset", this._source);
  },

  /**
   */

  indexOf: function (item) {
    return this._source.indexOf(item);
  },

  /**
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
   */

  at: function (index) {
    return this._source[index];
  },

  /**
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
   */

  push: function (item) {
    this._source.push(item);
    this._updateInfo();
    this.emit("insert", item, this._source.length - 1);
  },

  /**
   */

  unshift: function (item) {
    this._source.push(item);
    this._updateInfo();
    this.emit("insert", item, 0);
  },

  /**
   */

  splice: function (index, count) {
    var newItems = Array.prototype.slice.call(arguments, 2),
    oldItems     = this._source.splice.apply(this._source, arguments);

    this._updateInfo();
    this.emit("replace", newItems, oldItems, index);
  },

  /**
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
   */

  pop: function () {
    if (!this._source.length) return;
    return this.remove(this._source[this._source.length - 1]);
  },

  /**
   */

  shift: function () {
    if (!this._source.length) return;
    return this.remove(this._source[0]);
  },

  /**
   */

  _updateInfo: function () {
    this.set("first", this._source.length ? this._source[0] : undefined);
    this.set("length", this._source.length);
    this.set("empty", !this._source.length);
    this.set("last", this._source.length ? this._source[this._source.length - 1] : undefined);
  }
});

module.exports = BindableCollection;
