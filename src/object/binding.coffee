BindableSetter = require("./setters/factory")
bindableSetter = new BindableSetter()
utils = require "../core/utils"
toarray = require "toarray"
deepPropertyWatcher = require("./deepPropertyWatcher2")

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
   executes the binding now
  ###

  now: (value) -> 
    @_onChange @_listener.value()

  ###
   casts this binding as a collection binding
  ###

  collection: () ->
    return @_collectionBinding if @_collectionBinding
    @_collection = new Binding.Collection()

    # bind this object to the collection source
    @to @_collection.source
    @now()

    # create the collection binding
    @_collectionBinding = @_collection.bind().copyId(true)
  
  ###
   binds to a target
  ###

  to: (target, property, now = false) ->
    setter = bindableSetter.createSetter @, target, property

    if setter
      @_setters.push setter
      if now is true
        setter.now()

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
   DEPRECATED - use map
  ###

  transform: (options) -> @map arguments...

  ###
  ###

  map: (options) ->
    return @_map if not arguments.length
    @_map = utils.transformer options
    @


  ###
  ###

  _transformer: () ->
    @_transform or (@_transform = utils.transformer options)


  ###
   runs the binding just once
  ###

  once: () -> @limit 1

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

    setter.bothWays() for setter in @_setters

    @

  ###
   removes the binding
  ###

  dispose: () ->

    setter.dispose() for setter in @_setters

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
  ###

  _listen: () ->
    @_listener = deepPropertyWatcher.create { target: @_from, path: @_property.split("."), callback: @_onChange, index: 0, watchIndex: 0 }

    # if the object is disposed, then remove this listener
    @_disposeListener = @_from.once "dispose", () =>
      @dispose()


  ###
  ###

  _onChange: (value) =>
    value = @_listener?.value()
    return @ if @value is value
    @value = value

    setter.change(value) for setter in @_setters

    if ~@_limit and ++@_triggerCount >= @_limit
      @dispose()
    @


###
###


Binding.fromOptions = (target, options) ->
  binding = target.bind options.property or options.from
  to = toarray options.to


  for t in to
    tops = if typeof t is "object" then t.property else { property: t }

    if tops.transform or tops.map
      bindings.map tops.transform or tops.map

    binding.to tops.property

  if options.limit
    binding.limit options.limit

  if options.once
    binding.once()

  if options.bothWays
    binding.bothWays()

  if options.now
    binding.now()

  binding









