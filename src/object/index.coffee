dref = require "./dref"
require("dref").use require("../shim/dref")
EventEmitter = require("../core/eventEmitter")
Binding = require("./binding")

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



  ###
  ###

  _initData: (@data = {}) ->


  ###
  ###

  get: (key, flatten = false) -> 

    # return the deep ref of the data, OR ref of this object. Note that we pop off the first key
    # so there isn't a circular call to .get()
    dref.get(@data, key, flatten) ? dref.get(@[key.split(".").shift()], key.split(".").slice(1).join("."), flatten)

  ###
  ###

  toObject: (key) -> @get key, true

  ###
   DEPRECATED
  ###

  getFlatten: (key) -> @toObject key

  ###
  ###

  keys: () -> Object.keys @getFlatten()


  ###
  ###

  has: (key) -> !!@get key

  ###
  ###

  set: (key, value) ->

    # an object?
    if arguments.length is 1

      if key.__isBindable
        for k in key.keys()
          @set k, key.get(k)
        return


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

  reset: (newData = {}) ->
    
    @set newData

    for key of @data

      # delete key
      if not dref.get(newData, key)?
        @set key, undefined

    @


  ###
  ###

  _set: (key, value) ->
    return @ if not dref.set @, key, value

    @emit "change:#{key}", value
    @

  ###
  ###

  _ref: (context, key) -> 
    return context if not key
    dref.get context, key

  ###
  ###

  bind: (property, to) -> 

    if typeof property is "object"
      return Binding.fromOptions @, property

    # to cannot be a binding
    if to and to.__isBinding
      @set property, to
      return

    new Binding(@, property).to(to)

  ###
  ###

  dispose: () ->
    @emit "dispose"

  ###
  ###

  toJSON: () -> @data




module.exports.EventEmitter = EventEmitter
module.exports.propertyWatcher = require("./deepPropertyWatcher")