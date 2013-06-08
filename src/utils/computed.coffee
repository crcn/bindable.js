toarray = require "toarray"

module.exports = (properties, fn) ->
  properties = toarray properties
  fn.refs = properties
  fn

