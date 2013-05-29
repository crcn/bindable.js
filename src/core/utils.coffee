hoist = require "hoist"

exports.tryTransform  = (transformer, method, value) ->
  return value if not transformer
  return transformer[method].call(transformer, value)



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
  
