Base = require "./base"

module.exports = class extends Base
  
  ###
  ###

  constructor: (@binding, @callback) ->
    super @binding

  ###
  ###

  _change: (newValue, oldValue) ->
    @callback newValue, oldValue

  ###
  ###

  dispose: () ->
    @callback = null

  