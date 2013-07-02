utils = require "../../core/utils"

module.exports = class

  ###
  ###

  constructor: (@binding) ->

  ###
  ###

  change: (value) ->

    return if @_value is value

    oldValue = @_value
    @_value  = value

    @_change value, oldValue


  ###
  ###

  bothWays: () ->
    # OVERRIDE ME

  ###
  ###

  _change: (value) ->
    # OVERRIDE ME

