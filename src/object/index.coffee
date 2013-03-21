dref = require "dref"
EventEmitter2 = require("eventemitter2").EventEmitter2
Binding = require("./binding")

module.exports = class extends EventEmitter2

  ###
  ###

  constructor: (@data) ->
    super {
      wildcard: true
    }

  ###
  ###

  get: (key) ->
    dref.get(@data, key) or @_ref @, key

  ###
  ###

  has: (key) -> !!@get key

  ###
  ###

  set: (key, value) ->

    if arguments.length is 1
      for k of key
        @set k, key[k]
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

  bind: (property) -> new Binding @, property