Base    = require "./base"
toarray = require "toarray"

module.exports = class extends Base
  
  ###
  ###

  constructor: (@binding, @to, @property) -> 
    super @binding

  ###
  ###

  _change: (newValue) ->
    @_ignoreBothWays = true
    @to.set @property, newValue
    @_ignoreBothWays = false

  ###
  ###

  dispose: () ->
    @_bothWaysBinding?.dispose()

    @_bothWaysBinding = 
    @binding = 
    @to = 
    @properties = null

  ###
  ###

  bothWays: () ->
    @_bothWaysBinding = @to.bind(@property).map({
      to: () => toarray @binding._map.from arguments...
    }).to (values) =>
      return if @_ignoreBothWays
      for value, i in values 
        prop = @binding._properties[i]
        @binding._from.set prop, value

