poolParty = require("poolparty")
type      = require("type-component")

class PropertyWatcher

  ###
  ###

  constructor: (options) ->
    @reset options

    
  ###
  ###

  reset: (options) ->

    @target     = options.target
    @watch      = options.watch
    @path       = options.path
    @index      = options.index
    @root       = options.root or @
    @property   = @path[@index] 
    @callback   = options.callback
    @_children  = []
    @_listeners = []
    @_value     = undefined
    @_watching  = false

    # loop through the property?
    if @_each = @property.substr(0, 1) is "@"
      @property = @property.substr 1

    @_watch()


  ###
  ###

  value: () ->
    values = []
    @_addValues values
    return if values.length > 1 then values else values[0]

  ###
  ###

  _addValues: (values) ->

    unless @_children.length
      values.push @_value
      return

    for child in @_children
      child._addValues values

    undefined

  ###
  ###

  _dispose: () ->   
    listener.dispose() for listener in @_listeners
    child.dispose() for child in @_children
    @_children  = []
    @_listeners = []

  ###
  ###

  dispose: () ->  
    @_dispose()
    propertyWatcher.add @


  ###
  ###


  _watch: () ->

    if @target
      if @target.__isBindable

        if (nt = @target.get()).__isBindable
          @target = nt

        @watch      = @target
        @childPath  = @path.slice(@index)
        @childIndex = 1
        value       = @target.get(@property)
      else
        value       = @target[@property]
        @childPath  = @path
        @childIndex = @index + 1
    else
      @childPath = @path
      @childIndex = @index + 1
    

    if @_listeners.length
      @_dispose()


    @_value = value

    events = ["change:#{@childPath.slice(0, @childIndex - 1).concat(@property).join(".")}"]

    # value is a function? check if it's computed!
    if ((t = type(value)) is "function") and value.refs
      for ref in value.refs
        events.push "change:#{ref}"

    for event in events
      @_listeners.push @watch.on event, @_changed

    if @_each
      @_watchEachValue value, t
    else
      @_watchValue value

  ###
  ###

  _watchEachValue: (fnOrArray, t) ->
    switch t
      when "function" then @_callEach fnOrArray
      when "array" then @_loopEach fnOrArray
      when "undefined" then return
      else throw Error "'@#{@_property}' is a #{t}. '@#{@_property}' must be either an array, or function."
    
  ###
   asynchronous
  ###

  _callEach: (fn) ->
    fn.call @target, (value) => 
      @_watchValue value

  ###
   synchronous
  ###

  _loopEach: (values) ->
    for value in values
      @_watchValue value

  ###
  ###

  _watchValue: (value) ->
    if @childIndex < @childPath.length
      @_children.push propertyWatcher.create { watch: @watch, target: value, path: @childPath, index: @childIndex, callback: @callback, root: @root }


  ###
  ###

  _changed: (@_value) =>
    @root._watch()
    @callback()







propertyWatcher = module.exports = poolParty
  max: 100
  factory: (options) -> new PropertyWatcher options
  recycle: (watcher, options) -> watcher.reset options


#propertyWatcher = 
#  create: (options) -> new PropertyWatcher options
#  add: (watcher) ->


