BindableSetter = require("./setters/factory")
bindableSetter = new BindableSetter()
utils = require "../core/utils"
hoist = require "hoist"
toarray = require "toarray"
deepPropertyWatcher = require("./deepPropertyWatcher")

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
  ###

  watch: (value) ->
    return @_watch if not arguments.length
    @_watch = value
    @


  ###
   casts this binding as a collection binding
  ###

  collection: () ->
    return @_collectionBinding if @_collectionBinding
    @_collection = new Binding.Collection()

    # bind this object to the collection source
    @to @_collection.source


    # create the collection binding
    @_collectionBinding = @_collection.bind().copyId(true)

  
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

    @_transform = utils.transformer options

    @

  ###
  ###

  _transformer: () ->
    @_transform or (@_transform = utils.transformer options)


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

    if @_collectionBinding
      @_collectionBinding.dispose()

    if @_listener
      @_listener.dispose()
      @_disposeListener.dispose()

    @_listener = undefined
    @_disposeListener = undefined
    @

  ###
   triggers the binding *if* it exists
  ###

  _trigger: () ->
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
    @_listener = deepPropertyWatcher.create { target: @_from, property: @_property, callback: () =>
      @_trigger()
    }

    # if the object is disposed, then remove this listener
    @_disposeListener = @_from.once "dispose", () =>
      @dispose()

Binding.fromOptions = (target, options) ->
  binding = target.bind options.property or options.from
  to = toarray options.to


  for t in to
    tops = if typeof t is "object" then t.property else { property: t }

    if tops.transform
      bindings.transform tops.transform

    binding.to tops.property

  if options.limit
    binding.limit options.limit

  if options.once
    binding.once()

  if options.bothWays
    binding.bothWays()

  binding









