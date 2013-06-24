BindableSetter = require("./setters/factory")
bindableSetter = new BindableSetter()
utils = require "../core/utils"
options = require "../utils/options"
toarray = require "toarray"
deepPropertyWatcher = require("./deepPropertyWatcher2")
type = require "type-component"

###
 Glues stuff together
###

module.exports = class Binding

  ###
  ###

  __isBinding: true
  
  ###
  ###

  constructor: (@_from, properties) ->

    @_properties = if type(properties) is "string" then properties.split(/[,\s]+/g) else properties

    @_limit        = -1 # limit the number binding calls
    @_delay        = options.delay # delay for binding changes
    @_setters      = [] # listeners
    @_cvalues      = []
    @_listeners    = []
    @_triggerCount = 0  # keeps tally of bindings called

    @_listen()

  ###
  ###

  _values: () ->
    for listener, i in @_listeners
      v = listener.value()
      if v isnt @_cvalues[i]
        @_cvalues[i] = v

    @_cvalues

  ### 
   executes the binding now
  ###

  now: (value) -> 
    @_onChange @_values()

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

    from.bind(property).to(@_from, @_properties)

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
  ###

  delay: (value) ->
    return @_delay unless arguments.length
    @_delay = value
    @


  ###
   removes the binding
  ###

  dispose: () ->

    setter.dispose() for setter in @_setters

    @_setters = []

    if @_collectionBinding
      @_collectionBinding.dispose()

    if @_listeners
      listener.dispose() for listener in @_listeners
      disposeListener.dispose() for disposeListener in @_disposeListeners

    @_listeners        = []
    @_disposeListeners = []
    @

  ###
  ###

  _listen: () ->

    listeners = []
    disposeListeners = []

    for property in @_properties
      listeners.push deepPropertyWatcher.create { target: @_from, path: property.split("."), callback: @_onChange, index: 0, delay: @_delay }
      disposeListeners.push @_from.once "dispose", () =>
        @dispose()

    # if the object is disposed, then remove this listener
    @_disposeListeners = disposeListeners
    @_listeners        = listeners


  ###
  ###

  _onChange: (value) =>
    values = @_values()

    return @ unless values.length

    setter.change(values) for setter in @_setters

    if ~@_limit and ++@_triggerCount >= @_limit
      @dispose()
    @




###
###


Binding.fromOptions = (target, options) ->

  binding = target.bind options.from or options.property

  if type(options.to) is "object"
    for to of options.to
      tops = options.to[to]

      if tops.transform or tops.map
        binding.map tops.transform or tops.map

      if tops.now
        binding.now()

      if tops.bothWays
        binding.bothWays()

      binding.to to
  else
    options.to = toarray options.to
    for t in options.to
      tops = if typeof t is "object" then t else { property: t }

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







