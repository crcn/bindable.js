hoist = require "hoist"

exports.tryTransform  = (transformer, method, value, callback) ->
  return callback null, value if not transformer
  transformer[method].call(transformer, value, callback)



exports.transformer = (options) ->

  if typeof options is "function"
    options = {
      from: options,
      to: options
    }

  if not options.from
    options.from = (value) -> value


  if not options.to
    options.to = (value) -> value

  
  from: hoist.map(options.from)
  to: hoist.map(options.to)
  
