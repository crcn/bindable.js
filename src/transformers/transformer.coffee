module.exports = class

  ###
  ###

  constructor: (@_transform) ->

  ###
  ###

  default: (value) ->
    return @_defaultValue if not arguments.length
    @_defaultValue = value
    @

  ###
  ###

  set: (value) -> @_transform value or @_defaultValue


