dref      = require("dref")
poolParty = require("poolparty")
type      = require("type-component")

class PropertyWatcher
  
  ###
  ###

  constructor: (options) -> @reset options

  ###
  ###

  reset: (options) ->

    if options.property
      options.path = options.property.split(".")

    @index     = options.index or 0
    @_fullPath = options.path
    @_path     = @_fullPath.slice(0, @index)
    @_property = @_path.join(".")
    @target    = options.target
    @callback  = options.callback
    @_children = []


    if @_property.substr(0, 1) is "@"
      @_property = @_property.substr(1)
      @_callFn   = true

    @_watch()

  ###
  ###

  _dispose: () ->
    if @_listener
      @_listener.dispose()
      @_listener = undefined

    for child in @_children
      child.dispose()
      @_children = []

  ###
  ###

  dispose: () ->
    @_dispose()
    propertyWatcher.add @

  ###
  ###

  value: () ->
    values = []
    @_addValues values

    #if @_children.length is 1
    if values.length is 1
      return values[0]
    else
      return values




  ###
  ###

  _addValues: (values) ->

    # no children? add the value
    unless @_children.length
      values.push @_value

    for child in @_children 
      child._addValues values

  ###
  ###

  _watch: () ->
    if @_property.length
      value = @target.get(@_property)
      @_listener = @target.on "change:#{@_property}", @_changed
    else
      value = @target.get()

    if @_callFn
      @_watchEachValue value
    else
      @_watchValue value


  ###
  ###

  _watchEachValue: (fnOrArray) ->
    switch t = type fnOrArray
      when "function" then @_callEach fnOrArray
      when "array" then @_loopEach fnOrArray
      else throw Error "'@#{@_property}' is a #{t}. '@#{@_property}' must be either an array, or function."
    
  ###
   asynchronous
  ###

  _callEach: (fn) ->
    fn (value) => @_watchValue value

  ###
   synchronous
  ###

  _loopEach: (values) ->
    for value in values
      @_watchValue value

  ###
  ###

  _watchValue: (value) ->
    @_value = value
    if value and value.__isBindable
      @_children.push propertyWatcher.create { value: value, target: value, path: @_fullPath.slice(@index), callback: @_changed }
    else if @_path.length < @_fullPath.length
      @_children.push propertyWatcher.create { value: value, target: @target, path: @_fullPath, callback: @callback, index: @index + 1}
    else if !@_property.length
      @_value = @target



  ###
  ###

  _changed: (value) =>
    @_value = value
    @_dispose()
    @_watch()
    @callback value


  ###
  ###

  _childValues: () ->
    values = []
    for child in @_children
      values.push child
    values


propertyWatcher = module.exports = poolParty
  max: 100
  factory: (options) -> return new PropertyWatcher options
  recycle: (watcher, options) -> watcher.reset options




