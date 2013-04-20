utils = require "../../core/utils"

module.exports = class

  ###
  ###

  constructor: (@binding) ->
    @_transformer = @binding.transform()
    @init()

  ###
  ###

  init: () -> 

    # need to hydrate
    @_setValue @binding._from.get(@binding._property), (value) =>
      if not @binding.watch() 
        @_change value


  ###
  ###

  change: (value) ->
    @_setValue value, (value) =>
      @_change value


  ###
  ###

  _setValue: (value, callback) ->
    return false if @currentValue is value
    @__transform "to", value, (err, transformedValue) =>
      throw err if err
      callback @currentValue = transformedValue
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

