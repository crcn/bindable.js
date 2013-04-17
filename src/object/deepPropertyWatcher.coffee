dref = require("dref")
poolParty = require("poolparty")

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
    @_watch()

  ###
  ###

  _dispose: () ->
    if @_listener
      @_listener.dispose()
      @_listener = undefined

    if @_binding
      @_binding.dispose()
      @_binding = undefined

    if @_child
      @_child.dispose()
      @_child = undefined

  ###
  ###

  dispose: () ->
    @_dispose()
    propertyWatcher.add @


  ###
  ###

  _watch: () ->

    value = @target.get(@_property)

    if @_property.length
      @_listener = @target.on "change:#{@_property}", () => @_changed()


    if value and value.__isBindable
      @_binding = propertyWatcher.create { target: value, path: @_fullPath.slice(@index), callback: (() => @_changed()) }
    else if @_path.length < @_fullPath.length
      @_child = propertyWatcher.create { target: @target, path: @_fullPath, callback: @callback, index: @index + 1}


  ###
  ###

  _changed: () ->
    @_dispose()
    @_watch()
    @callback()


propertyWatcher = module.exports = poolParty({
  max: 100
  factory: (options) -> return new PropertyWatcher options
  recycle: (watcher, options) -> watcher.reset options
})



