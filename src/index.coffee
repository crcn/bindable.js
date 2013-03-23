dref = require "dref"
EventEmitter = require("./core/eventEmitter")
Binding = require("./binding")
Builder = require("./builder")
Transformers = require("./transformers")

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

    transformedValue = @_transform key, value

      
    dref.set @data, key, transformedValue


    @emit "change:#{key}", transformedValue
    @emit "change", transformedValue
    @

  ###
  ###

  transform: (key, transformer) -> 
    transformer = @_transformer().use key, transformer
    @set key, transformer.set @get key


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

  _transform: (key, value, next) ->
    return value if not @__transformer
    return @__transformer.set(key, value)


  ###
  ###

  _transformer: () ->
    @__transformer || (@__transformer = new Transformers(@))

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