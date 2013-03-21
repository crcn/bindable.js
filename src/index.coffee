dref = require "dref"
EventEmitter = require("./core/eventEmitter")
Binding = require("./binding")
Builder = require("./builder")

dref.use require("./shim/dref")

module.exports = class Bindable extends EventEmitter

  ###
  ###

  constructor: (@data = {}) ->
    super()

    # init bindings
    @_init()

  ###
  ###

  get: (key) ->
    @_ref(@data, key) or @_ref @, key

  ###
  ###

  has: (key) -> !!@get key

  ###
  ###

  set: (key, value) ->

    # an object?
    if arguments.length is 1
      for k of key
        @set k, key[k]
      return

    # a binding?
    if value and value.__isBinding
      value.to @, key
      return

    dref.set @data, key, value

    @emit "change:#{key}", value
    @emit "change", value

  ###
  ###

  _ref: (context, key) -> 
    return context if not key
    dref.get context, key


  ###
  ###

  _init: () ->

    # check for bindings specified in the class
    for key of @
      obj = @[key]

      # if it's a call chain, then delete it, and create the binding
      if obj and obj.__isCallChain
        @[key] = undefined

        # create the binding
        obj.createObject(@, key)


  ###
  ###

  bind: (property, to) -> 

    # to cannot be a binding
    if to and to.__isBinding
      @set property, to
      return

    new Binding(@, property).to(to)


new Builder(Binding, Bindable)


module.exports.EventEmitter = EventEmitter