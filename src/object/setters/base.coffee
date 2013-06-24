utils = require "../../core/utils"

module.exports = class

  ###
  ###

  constructor: (@binding) ->
    @_transformer = @binding._map or @binding.transform()

  ###
  ###

  change: (values) ->

    transformedValue = @__transform "to", values

    # TODO - see if initialized
    return if @_value is transformedValue 
    #else
    #  @_initialized = true

    oldValue = @_value
    @_value  = transformedValue

    @_change transformedValue, oldValue


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

  __transform: (method, values) -> 
    return values[0] if not @_transformer
    utils.tryTransform @_transformer, method, values

