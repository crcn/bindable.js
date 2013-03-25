dref         = require "dref"
Binding      = require "./binding"
EventEmitter = require "../core/eventEmitter"

###
###

module.exports = class extends EventEmitter

  ###
  ###

  __isCollection: true
  
  ###
  ###

  constructor: (source = []) ->
    @_length = 0
    @_source = source
    @_setDefaultIndexer()

  ###
  ###

  length: () ->
    @_length

  ###
  ###

  source: () ->
    @_source

  ###
  ###

  reset: (source) -> 
    @_remove @_source
    @_insert @_source = source

  ###
  ###

  bind: (to) -> new Binding(@).to(to)

  ###
  ###

  set: (index, value) -> @splice index, 1, value

  ###
  ###

  get: (index) -> @at key

  ###
  ###

  at: (index) -> @_source[index]

  ###
  ###

  update: (item) -> 
    #O TODO

  ###
  ###

  remove: (item) ->
    index = @indexOf item
    if not ~index
      return false
    @splice index, 1
    true  

  ###
  ###

  filter: (cb) -> @_source.filter cb

  ###
  ###

  splice: (index, count) ->
    args = Array.prototype.slice.call(arguments)
    args.splice(0, 2) # remove index & count. Leave only items to replace with
    @_length += (args.length - count)

    remove = @slice(index, index + count)

    @_source.splice.apply @_source, arguments

    @_remove remove, index
    @_insert args, index

  ###
  ###

  slice: (start, end) -> @_source.slice start, end

  ###
  ###

  indexOf: (item) -> @_indexer(@_source, item)

  ###
  ###

  indexer: (value) ->
    return @_indexer if not value
    @_indexer = value
    @

  ###
  ###

  _id: (key) ->
    @indexer (source, itemCheck) =>

      for item, i in source
        if String(dref.get(item, key)) is String(dref.get(itemCheck, key))
          return i

      return -1

  ###
  ###

  push: () ->
    items = Array.prototype.slice.call(arguments)

    @_length += items.length
    @_source.push.apply @_source, arguments
    @_insert items, @_length

  ###
  ###

  unshift: () ->
    items = Array.prototype.slice.call(arguments)

    @_length += items.length
    @_source.unshift.apply @_source, arguments
    @_insert items

  ###
  ###

  pop: () ->
    @_remove @_source.pop(), @_length--

  ###
  ###

  shift: () ->
    @_length--
    @_remove @_source.shift(), 0

  ###
  ###

  _setDefaultIndexer: () ->
    @indexer (source, item) ->
      return source.indexOf(item)

  ###
  ###

  _insert: (items, start = 0) ->

    return if not items.length

    for item, i in items
      @emit "insert", item, start + i

  ###
  ###

  _remove: (items, start = 0) ->
    for item, i in items
      @emit "remove", item, start + i








