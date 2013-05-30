utils = require "../../core/utils"

module.exports = class

  ###
  ###

  constructor: (@binding) ->
    @_transformer = @binding.transform()
    @now()

  ###
  ###

  now: () ->
    @change @binding._from.get(@binding._property), not @binding.watch()


  ###
  ###

  change: (value, call) ->
    return if @currentValue is value
    transformedValue = @__transform "to", value
    return if @currentValue is transformedValue 
    @currentValue = transformedValue
    return if call is false
    @_change transformedValue


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

  __transform: (method, value) -> utils.tryTransform @_transformer, method, value

