Base = require "./base"

module.exports = class extends Base
  
  ###
  ###

  constructor: (@binding, @callback) ->
    super @binding

  ###
  ###

  _change: (value) -> @callback value

  ###
  ###

  dispose: () ->
    @callback = null

  