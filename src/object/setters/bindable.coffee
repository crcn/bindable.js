Base    = require "./base"
type    = require "type-component"

module.exports = class extends Base
  
  ###
  ###

  constructor: (@binding, @to) -> 
    super @binding

  ###
  ###

  _change: (newValue) ->
    @_ignoreBothWays = true
    @to.set newValue
    @_ignoreBothWays = false

  ###
  ###

  dispose: () ->
    @_bothWaysBinding?.dispose()

    @_bothWaysBinding = 
    @binding = 
    @to = 
    @properties = null
