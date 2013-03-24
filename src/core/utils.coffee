exports.tryTransform  = (transformer, method, value, callback) ->
  return callback null, value if not transformer
  transformer[method].call(transformer, value, callback)
