utils = require "../../core/utils"

module.exports = class

  ###
  ###

  constructor: (@binding) ->
    @_transformer = @binding.transform()

  ###
  ###

  change: (value) ->

    transformedValue = @__transform "to", value

    # TODO - see if initialized
    return if @_value is transformedValue 
    #else
    #  @_initialized = true
    oldValue = @_value
    @_value = transformedValue

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

  __transform: (method, value) -> utils.tryTransform @_transformer, method, value

