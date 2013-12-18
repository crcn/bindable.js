type      = require("type-component")
options   = require("../utils/options")

class PropertyWatcher
  
  ###
  ###


  __isPropertyWatcher: true

  ###
  ###

  constructor: (options) ->


    @target     = options.target
    @watch      = options.watch
    @path       = options.path
    @index      = options.index
    @root       = options.root or @
    @delay      = options.delay
    @parent     = options.parent


    @property   = @path[@index] 
    @_children  = []
    @_bindings  = []
    @_value     = undefined
    @_values    = undefined
    @_watching  = false
    @_updating  = false
    @_disposed  = false

    # loop through the property?
    # @
    if @property.charCodeAt(0) is 64
      @_each = true
      @root._computeEach = true
      @property = @property.substr 1

    @_watch()

  ###
  ###

  value: () ->
    values = []
    @_addValues values
    return if @_computeEach then values else values[0]

  ###
  ###

  _addValues: (values) ->

    unless @_children.length
      if @_values
        values.push @_values...
      else if @_value?
        values.push @_value
      return

    for child in @_children
      child._addValues values

    undefined

  ###
  ###

  dispose: () ->  
    @_disposed = true 
    @_listener?.dispose()
    @_listener = undefined
    binding.dispose() for binding in @_bindings
    child.dispose() for child in @_children
    @_children  = []
    @_bindings  = []

  ###
  ###

  _update: () ->
    unless ~@delay
      @_watch()
      @parent.now()
      return
      
    return if @_updating
    @_updating = true
    @_disposed = false
    setTimeout (() =>
      return if @_disposed # disposed
      @_watch()
      @parent.now()
    ), @delay

  ###
  ###

  _watch: () ->
    @_updating = false


    if @target
      if @target.__isBindable

        if (nt = @target.__context)?.__isBindable
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
    

    if @_listener
      @dispose()


    @_value = value


    # value is a function? check if it's computed!
    if (typeof value is "function") and value.refs
      for ref in value.refs
        @_watchRef ref

    if @childIndex is 1
      prop = @property
    else 
      prop = @childPath.slice(0, @childIndex - 1).concat(@property).join(".")
    
    @_listener = @watch.on "change:#{prop}", @now

    if @_each
      @_watchEachValue value, type(value)
    else
      @_watchValue value

    # notifies the target that this property is being watched
    @watch._watching prop

  ###
  ###

  _watchEachValue: (fnOrArray, t) ->

    # computed properties should always have a delay
    unless ~@root.delay
      @root.delay = options.computedDelay

    switch t
      when "function" then @_callEach fnOrArray
      when "array" then @_loopEach fnOrArray
      when "undefined" then return
      else throw Error "'@#{@_property}' is a #{t}. '@#{@_property}' must be either an array, or function."
    
  ###
   asynchronous
  ###

  _callEach: (fn) ->
    @_values = []
    fn.call @target, (value) => 
      @_values.push value
      @_watchValue value

  ###
   synchronous
  ###

  _loopEach: (values) ->
    for value in values
      @_watchValue value
    undefined

  ###
  ###

  _watchValue: (value) ->
    if @childIndex < @childPath.length
      @_children.push new PropertyWatcher { watch: @watch, target: value, path: @childPath, index: @childIndex, parent: @, root: @root, delay: @delay }

  ###
  ###

  _watchRef: (ref) ->
    @_bindings.push new PropertyWatcher { target: @target, path: ref.split("."), index: 0, parent: @, delay: @delay }
 
  ###
  ###

  now: (@_value) =>
    @root._update()

module.exports = PropertyWatcher