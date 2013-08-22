dref         = require "./dref"
EventEmitter = require("../core/eventEmitter")
Binding      = require("./binding")

module.exports = class Bindable extends EventEmitter

  ###
  ###

  __isBindable: true

  ###
  ###

  constructor: (@__context = {}) ->
    super()
    @_bindings = []

  ###
  ###

  context: (data) ->
    return @__context unless arguments.length
    @__context = data


  ###
  ###

  _watching: (property) ->

  ###
  ###

  get: (key, flatten = false) -> 

    # return the deep ref of the data, OR ref of this object. Note that we pop off the first key
    # so there isn't a circular call to .get()
    ret = dref.get(@__context, key, flatten)

    return ret if ret?

    keyParts  = key.split(".")
    firstProp = keyParts.shift()
    ret       = dref.get(@[firstProp], keyParts.join("."), flatten) 

    if ret?
      dref.set @, firstProp, ret

    ret

  ###
  ###

  toObject: (key) -> @get key, true

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
      
    @_set key, value

  ###
  ###

  reset: (newData = {}) ->
    
    @set newData

    for key of @__context

      # delete key
      if not dref.get(newData, key)?
        @set key, undefined

    @


  ###
  ###

  _set: (key, value) ->
    return @ if not dref.set @, key, value

    @emit "change:#{key}", value
    @emit "change", key, value
    @


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

  dispose: () -> @emit "dispose"

  ###
  ###

  toJSON: () -> @__context



module.exports.EventEmitter = EventEmitter
module.exports.propertyWatcher = require("./deepPropertyWatcher")