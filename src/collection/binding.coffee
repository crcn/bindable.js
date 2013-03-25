sift           = require "sift"
SettersFactory = require "./setters/factory"
settersFactory = new SettersFactory()
utils = require "../core/utils"

module.exports = class

  ###
  ###

  constructor: (@_from) ->
    @_limit = -1
    @_setters = []
    @_listen()

  ###
  ###

  transform: (value) ->
    return @_transformer if not arguments.length
    @_transformer = utils.transformer value
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

  _dispose: (collection) ->
    if collection
      for disposable in collection
        disposable.dispose()


  ###
  ###

  filter: (search) ->
    return @_filter if not arguments.length
    @_filter = sift search
    @

  ###
  ###

  to: (collection) ->
    setter = settersFactory.createSetter @, collection
    if setter
      @_setters.push setter
    @

  ###
  ###

  _listen: () ->
    @_listeners = []

    for event in ["insert", "remove", "update"] then do (event) =>
      @_listeners.push @_from.on event, (item, index) =>
        @_callSetters event, item, index

  ###
  ###

  _callSetters: (method, item) ->
    for setter in @_setters
      setter.change method, item


