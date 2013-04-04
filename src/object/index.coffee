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

    # copy all data from this bindable object
    for key of @
      obj = @[key]

      # skip private properties OR value object if function OR data already exists
      continue if typeof obj is "function" or key.substr(0, 1) is "_" or @data[key]

      # check for bindings specified in the class
      if obj and obj.__isCallChain
        @[key] = undefined

        # create the binding
        obj.createObject(@, key)
      else
        @set key, obj

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