BindableSetter = require("./setters/factory")
bindableSetter = new BindableSetter()
Transformer    = require "../core/transformer"

###
 Glues stuff together
###

module.exports = class Binding

  ###
  ###

  __isBinding: true
  
  ###
  ###

  constructor: (@_from, @_property) ->

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
   from property? create a binding going the other way. This is useful for classes. see class-test.js
  ###

  from: (from, property) ->

    if arguments.length is 1
      property = from
      from = @_from

    from.bind(property).to(@_from, @_property)


  ###
  ###

  transform: (options) ->
    return @_transform if not arguments.length
    @_transform = new Transformer options
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

    @_callSetterFns "bothWays"

    @

  ###
   removes the binding
  ###

  dispose: () ->

    @_callSetterFns "dispose"

    @_setters = []

    if @_listener
      @_listener.dispose()

    @_listener = undefined
    @

  ###
   triggers the binding *if* it exists
  ###

  _trigger: () =>

    @_callSetterFns "change", [@_from.get(@_property)]

    if ~@_limit and ++@_triggerCount > @_limit
      @dispose()

    @

  ###
  ###

  _callSetterFns: (method, args) ->
    for setter in @_setters
      setter[method].apply(setter, (args or []))


  ###
  ###

  _listen: () ->
    keyParts = @_property.split "."

    # start from the ROOT property
    event = "change:#{keyParts.shift()}.**"

    @_listener = @_from.on event, @_trigger






