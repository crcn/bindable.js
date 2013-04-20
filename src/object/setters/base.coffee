utils = require "../../core/utils"

module.exports = class

  ###
  ###

  constructor: (@binding) ->
    @_transformer = @binding.transform()

    if not @binding.watch() 
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
    # OVERRIDE ME

  ###
  ###

  _change: (value) ->
    # OVERRIDE ME


  ###
  ###

  __transform: (method, value, next) ->
    utils.tryTransform @_transformer, method, value, next

