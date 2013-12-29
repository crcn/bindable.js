var BindableObject = require("../object"),
computed           = require("../utils/computed");

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

  source: function (source) {
    this._source = source;
    this._updateInfo();
    this.emit("reset", source);
  },

  /**
   */

  indexOf: function (item) {
    return this._source.indexOf(item);
  },

  /**
   */

  at: function (index) {
    this._source[index];
  },

  /**
   */

  each: computed(["length"], function (fn) {
    this._source.forEach(fn);
  }),

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
