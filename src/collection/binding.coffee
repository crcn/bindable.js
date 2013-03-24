SettersFactory = require "./setters/factory"
settersFactory = new SettersFactory()
Transformer = require "../core/transformer"

module.exports = class

  ###
  ###

  constructor: (@_from) ->
    @_setters = []
    @_listen()


  ###
  ###

  transform: (value) ->
    return @_transformer if not arguments.length
    @_transformer = new Transformer value
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
    for event in ["insert", "remove", "update"] then do (event) =>
      @_from.on event, (item, index) =>
        @_callSetters event, item, index


  ###
  ###

  _callSetters: (method, item) ->
    for setter in @_setters
      setter.change method, item


