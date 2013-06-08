SettersFactory = require "./setters/factory"
settersFactory = new SettersFactory()
utils          = require "../core/utils"

module.exports = class

  ###
  ###

  constructor: (@_from) ->
    @_limit = -1
    @_setters = []
    @_listen()

  ###
  ###

  transform: () -> @map arguments...

  ###
  ###

  map: (value) -> 
    return @_transformer if not arguments.length
    @_transformer = utils.transformer value
    @

  ###
  ###

  now: () ->
    for setter in @_setters
      setter.now()
    @


  ###
  ###

  dispose: () ->
    @_dispose @_setters
    @_setters = undefined

    @_dispose @_listeners
    @_listeners = undefined
    
  ###
  ###

  copyId: (value) ->
    return @_copyId if not arguments.length
    @_copyId = value
    @

  ###
  ###

  _dispose: (collection) ->
    if collection
      for disposable in collection
        disposable.dispose()


  ###
  ###

  filter: (search) ->
    return @_filter if not arguments.length
    @_filter = search
    @

  ###
  ###

  to: (collection, now = true) ->
    setter = settersFactory.createSetter @, collection
    if setter
      @_setters.push setter
      if now is true
        setter.now()
    @

  ###
  ###

  _listen: () ->
    @_listeners = []

    for event in ["insert", "remove", "reset"] then do (event) =>
      @_listeners.push @_from.on event, (item, index) =>
        @_callSetters event, item, index

  ###
  ###

  _callSetters: (method, item, index) ->
    for setter in @_setters
      setter.change method, item, index


