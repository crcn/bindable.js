dref            = require "dref"
Binding         = require "./binding"
EventEmitter    = require "../core/eventEmitter"
type            = require "type-component"
hoist           = require "hoist"
BindableObject  = require "../object"
computed        = require "../utils/computed"


###
###

module.exports = class extends BindableObject

  ###
  ###

  __isCollection: true
  
  ###
  ###

  constructor: (source = [], _id = "_id") ->
    super @

    @_source = []

    if type(source) is "string"
      _id = source
      source = []
      
    @_length = 0
    @_id _id
    @__enforceId = false
    @transform().postMap @_enforceItemId
    @reset source

  ###
  ###

  source: (value) =>
    return @_source if not arguments.length
    @reset value

  ###
  ###

  reset: (source) => 

    if not source
      source = []

    @disposeSourceBinding()

    @_remove @_source or []

    if source.__isCollection  
      @_source = []
      @_id source._id()
      @_sourceBinding = source.bind().to(@).now()
      return @
    
    @_insert @_source = @_transform source
    @_resetInfo()

    @

  ###
  ###

  disposeSourceBinding: () -> 
    if @_sourceBinding
      @_sourceBinding.dispose()
      @_sourceBinding = undefined

  ###
  ###

  bind: (to) -> 
    return super(arguments...) if type(to) is "string"
    new Binding(@).to(to)

  ###
  ###

  set: (key, value) ->
    k = Number key
    return super(arguments...) if isNaN k
    @splice k, value 

  ###
  ###

  get: (key) -> 
    k = Number key
    return super(key) if isNaN k
    @at k

  ###
  ###

  at: (index) -> @_source[index]

  ###
  ###

  first: () -> @_source[0]

  ###
  ###

  last: () -> @_source[@_length - 1]

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

  each: computed "length", (fn) ->
    for item in @_source
      fn item

  ###
  ###

  splice: (index, count) ->
    args = Array.prototype.slice.call(arguments)
    args.splice(0, 2) # remove index & count. Leave only items to replace with
    args = @_transform args

    remove = @slice(index, index + count)

    @_source.splice.apply @_source, arguments

    @_remove remove, index
    @_insert args, index

  ###
  ###

  transform: () -> @_transformer or (@_transformer = hoist())

  ###
  ###

  slice: (start, end) -> @_source.slice start, end

  ###
   deprecated
  ###

  indexOf: (searchItem) ->  
    @searchIndex searchItem

  ###
  ###
  update: (item) ->
    # TODO

  ###
  ###

  searchIndex: (searchItem) ->
    for item, i in @_source
      if @_get(item, @__id) is @_get(searchItem, @__id)
        return i
    return -1

  ###
  ###

  _get: (item, id) ->
    return undefined unless item
    item.get?(id) ? item[id]

  ###
  ###

  _id: (key) ->
    return @__id if not arguments.length
    return @ if @__id is key
    @__id = key

    if @_source
      @_enforceId()
    @

  ###
  ###

  push: () ->
    items = @_transform Array.prototype.slice.call(arguments)
    @_source.push.apply @_source, items
    @_insert items, @_length

  ###
  ###

  unshift: () ->
    items = @_transform Array.prototype.slice.call(arguments)
    @_source.unshift.apply @_source, items
    @_insert items


  ###
  ###

  toJSON: () ->
    source = []
    for item in @_source
      source.push item.toJSON?() or item

    source

  ###
  ###

  pop: () ->
    return unless @_source.length
    @_remove([@_source.pop()], @_length)[0]

  ###
  ###

  shift: () ->
    return unless @_source.length
    @_remove([@_source.shift()], 0)[0]

  ###
  ###

  enforceId: (value) ->
    return @__enforceId if not arguments.length
    @__enforceId = value

  ###
  ###

  _enforceId: () ->
    for item in @_source
      @_enforceItemId item

  ###
  ###

  _enforceItemId: (item) =>
    return item if not @__enforceId
    _id = @_get(item, @__id)
    if (_id is undefined) or (_id is null)
      throw new Error "item '#{item}' must have a '#{@__id}'"

    item

  ###
  ###

  _insert: (items, start = 0) ->
    return if not items.length
    @_length += items.length
    @_resetInfo()
    for item, i in items
      @emit "insert", item, start + i
    items

  ###
  ###

  _remove: (items, start = 0) ->
    return if not items.length
    @_length -= items.length
    @_resetInfo()
    for item, i in items
      @emit "remove", item, start + i
    items


  ###
  ###

  _resetInfo: () ->
    @set "length", @_length
    @set "first", @at(0)
    @set "last", @at(@length - 1)
    @set "empty", not @_length



  ###
  ###

  _transform: (item, index, start) ->
    return item if not @_transformer
    if type(item) is "array"
      results = []
      for i in item
        results.push @_transformer i
      return results
    return @_transformer item








