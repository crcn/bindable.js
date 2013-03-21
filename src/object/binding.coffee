BindableSetter = require("./setters/factory")
bindableSetter = new BindableSetter()


###
 Glues stuff together
###

module.exports = class

  ###
  ###

  __isBinding: true
  
  ###
  ###

  constructor: (@from, @property) ->

    @_limit        = -1
    @_setters      = []
    @_triggerCount = 0

    @_listen()
  
  ###
   binds to a target
  ###

  to: (target, property) ->
    setter = bindableSetter.createSetter @, target, property

    if setter
      @_setters.push setter

    @


  ###
   runs the binding just once
  ###

  once: () -> @limit 0


  ###
   limits the number of times the binding can be called
  ###

  limit: (count) -> 
    @_limit = count
    @

  ###
   returns whether the binding is bound with ways
  ###

  isBothWays: () -> !!@_boundBothWays


  ###  
   makes the binding go both ways.
  ###

  bothWays: () ->
    return @ if @_boundBothWays
    @_boundBothWays = true


    for setter in @_setters
      setter.bothWays()

    @

  ###
   removes the binding
  ###

  dispose: () ->

    for setter in @_setters
      setter.dispose()

    @_setters = []

    if @_listener
      @_listener.dispose()

    @_listener = undefined
    @

  ###
   triggers the binding *if* it exists
  ###

  _trigger: () =>

    value = @from.get @property

    # trigger change against everything
    for setter in @_setters
      setter.change value

    if ~@_limit and ++@_triggerCount > @_limit
      @dispose()


    @


  ###
  ###

  _listen: () ->
    keyParts = @property.split "."

    # start from the ROOT property
    event = "change:#{keyParts.shift()}.**"

    @_listener = @from.on event, @_trigger




