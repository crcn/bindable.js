module.exports = class

  ###
  ###

  constructor: (@binding) ->
    @init()

  ###
  ###

  init: () -> @change @binding.from.get @binding.property

  ###
  ###

  change: (value) ->
    return false if @currentValue is value
    @_change @currentValue = value
    true

  ###
  ###

  bothWays: () ->


  ###
  ###

  _change: (value) ->
    # OVERRIDE ME
