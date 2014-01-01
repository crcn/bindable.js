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

    for (var i = this._source.length; i--;) {
      this.emit("remove", this._source[i]);
    }


    this._source = source || [];

    for (var i = this._source.length; i--;) {
      this.emit("insert", this._source[i]);
    }

    this._updateInfo();

    // this.emit("reset", this._source);
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
    this.emit("insert", item);
  },

  /**
   */

  unshift: function (item) {
    this._source.push(item);
    this._updateInfo();
    this.emit("insert", item);
  },

  /**
   */

  splice: function (index, count) {
    var newItems = Array.prototype.slice.call(arguments, 2),
    oldItems     = this._source.splice.apply(this._source, arguments);

    for (var i = oldItems.length; i--;) {
      this.emit("remove", oldItems[i]);
    }

    for (var i = newItems.length; i--;) {
      this.emit("insert", newItems[i]);
    }

    this._updateInfo();
    //this.emit("replace", newItems, oldItems, index);
  },

  /**
   */

  remove: function (item) {
    var i = this.indexOf(item);
    if (!~i) return false;
    this._source.splice(i, 1);
    this._updateInfo();
    this.emit("remove", item);
  },

  /**
   */

  _updateInfo: function () {
    this.set("length", this._source.length);
  }
});

module.exports = BindableCollection;
