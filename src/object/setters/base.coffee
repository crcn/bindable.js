utils = require "../../core/utils"

module.exports = class

  ###
  ###

  __isSetter: true

  ###
  ###

  constructor: (@binding) ->
    @_map = binding.map()

  ###
  ###

  change: (values) ->
    
    value = @_map.to values...

    return false if @_value is value

    oldValue = @_value
    @_value  = value

    @_change value, oldValue
    true

  ###
  ###

  bothWays: () ->
    # OVERRIDE ME

  ###
  ###

  _change: (value) ->
    # OVERRIDE ME

