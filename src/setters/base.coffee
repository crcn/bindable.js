module.exports = class

  ###
  ###

  constructor: (@binding) ->
    @_transform = @binding.transform()
    @init()

  ###
  ###

  init: () -> @change @binding._from.get @binding._property

  ###
  ###

  change: (value) ->
    return false if @currentValue is value

    @__transform "to", value, (err, transformedValue) =>
      throw err if err
      @_change @currentValue = transformedValue

    true


  ###
  ###

  bothWays: () ->


  ###
  ###

  _change: (value) ->
    # OVERRIDE ME


  ###
  ###

  __transform: (method, value, next) ->

    transform = @_transform?[method]

    return next(null, value) if not transform

    if transform.length is 1
      next(null, transform(value))
    else
      transform value, next

