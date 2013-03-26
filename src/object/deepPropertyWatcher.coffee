dref = require("dref")
poolParty = require("poolparty")



  

class DeepPropertyWatcher

  ###
  ###

  constructor: (options) ->
    @reset options


  ###
  ###

  reset: (options) ->
    @_disposed = false
    @target   = options.target
    @property = options.property
    @callback = options.callback
    @_chain = @property.split(".")
    @_watch()

  ###
  ###

  dispose: () ->
    if @_listeners
      for listener in @_listeners
        listener.dispose()

      @_listeners = undefined

  ###
  ###

  _watch: () ->

    if @_listeners
      @dispose()

    @_listeners = []

    for part, i in @_chain

      property = @_chain.slice(0, i + 1).join(".")
      value = @target.get(property)

      # if the item is bindable, then we need to WATCH that bindable item for any changes. This is needed for when we have a case like this
      # bindable.bind("name.last", function() { });
      # bindable.get("name").set("last", "jefferds")
      if value and value.__isBindable
        @_listeners.push deepPropertyWatcher.create { target: value, property: @_chain.slice(i + 1).join("."), callback: @changed }
      else
        @_listeners.push @target.on "change:#{property}", @changed

  ###
  ###

  changed: () =>

    @callback()

    # re-create the bindings since shit could have changed
    @_watch()

deepPropertyWatcher = module.exports = {
  create: (options) -> new DeepPropertyWatcher options
}

return
deepPropertyWatcher = module.exports = poolParty({
  max: 100,
  factory: (options) -> new DeepPropertyWatcher(options)
  recycle: (watcher, options) -> watcher.reset options
})