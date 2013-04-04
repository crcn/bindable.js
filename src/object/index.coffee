dref = require "./dref"
require("dref").use require("../shim/dref")
EventEmitter = require("../core/eventEmitter")
Binding = require("./binding")
Builder = require("../core/builder")

module.exports = class Bindable extends EventEmitter

  ###
  ###

  __isBindable: true

  ###
  ###

  constructor: (data) ->
    super()
    @_initData data
    @_bindings = []

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

  _initData: (@data = {}) ->

  ###
  ###

  get: (key) -> return dref.get @,key

  ###
  ###

  toJSON: () -> @data

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

    @_set key, value

  ###
  ###

  _set: (key, value) ->
    dref.set @, key, value


    @emit "change:#{key}", value
    @emit "change", value
    @

  ###
  ###

  _ref: (context, key) -> 
    return context if not key
    dref.get context, key

  ###
  ###

  bind: (property, to) -> 

    # to cannot be a binding
    if to and to.__isBinding
      @set property, to
      return

    new Binding(@, property).to(to)


  ###
  ###

  dispose: () ->
    @emit "dispose"



new Builder(Binding, Bindable)


module.exports.EventEmitter = EventEmitter