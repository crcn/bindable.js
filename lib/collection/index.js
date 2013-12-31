var BindableObject = require("../object"),
computed           = require("../utils/computed"),
sift               = require("sift");

/**
 */

function BindableCollection(source) {
  BindableObject.call(this, this);
  this._source = source || [];
  this.length = this._source.length;
}

/**
 */

BindableObject.extend(BindableCollection, {

  /**
   */

  reset: function (source) {
    return this.source(source);
  },

  /**
   */

  source: function (source) {

    if (!arguments.length) return this._source;

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

  push: function (item) {
    this._source.push(item);
    this._updateInfo();
    this.emit("insert", { item: item, index: this._source.length - 1 });
  },

  /**
   */

  unshift: function (item) {
    this._source.push(item);
    this._updateInfo();
    this.emit("insert", { item: item, index: 0 });
  },

  /**
   */

  splice: function (index, count) {
    var newItems = Array.prototype.slice.call(arguments, 2),
    oldItems     = this._source.splice.apply(this._source, arguments);
    this.emit("replace", { newItems: newItems, oldItems: oldItems, index: index });
  },

  /**
   */

  remove: function (item) {
    var i = this.indexOf(item);
    if (!~i) return false;
    this._source.splice(i, 1);
    this._updateInfo();
    this.emit("remove", { item: item, index: i });
  },

  /**
   */

  _updateInfo: function () {
    this.set("length", this._source.length);
  }
});

module.exports = BindableCollection;
