Base = require "./base"

module.exports = class extends Base
  
  ###
  ###

  constructor: (@binding, @to, @property) -> 
    super @binding

  ###
  ###

  _change: (value) ->
    @to.reset value

  ###
  ###

  dispose: () -> @to.disposeSourceBinding()
