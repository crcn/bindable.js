Base = require "./base"

module.exports = class extends Base
  
  ###
  ###

  constructor: (@binding, @to, @property) -> 
    super @binding

  ###
  ###

  _change: (value) ->
    @to.set @property, value

  ###
  ###

  dispose: () ->
    return if not @_disposable
    @_disposable.dispose()

    @_disposable = 
    @binding = 
    @to = 
    @property = null

  ###
  ###

  bothWays: () ->

    # create a binding going the other way!
    @_disposable = @to.bind(@property).to (value) =>
      if @currentValue isnt value
        @_changeFrom value


  ###
  ###

  _changeFrom: (value) ->
    @__transform "from", value, (err, transformedValue) =>
      throw err if err
      @binding._from.set @binding._property, @currentValue = transformedValue

