utils = require "../../core/utils"

module.exports = class

  ###
  ###

  constructor: (@binding) ->
    @_transformer = @binding.transform()

  ###
  ###

  now: () -> 
    @change @binding._from.get(@binding._property)

  ###
  ###

  change: (value) ->

    transformedValue = @__transform "to", value

    # TODO - see if initialized
    return if @_value is transformedValue 
    #else
    #  @_initialized = true

    @_value = transformedValue

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

