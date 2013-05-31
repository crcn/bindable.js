Base = require "./base"

module.exports = class extends Base
  
  ###
  ###

  constructor: (@binding, @to, @property) -> 
    super @binding

  ###
  ###

  _change: (newValue, oldValue) ->
    @to.reset newValue, oldValue

  ###
  ###

  dispose: () -> @to.disposeSourceBinding()
