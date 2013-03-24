utils = require("../../core/utils")

module.exports = class 
  
  ###
  ###

  constructor: (@binding, @target) ->
    @_transformer = binding.transform()
    @init()

  ###
  ###

  init: () ->
    # override me
  
  ###
  ###

  change: (event, item) ->
    @__transform "to", item, (err, item) =>
      throw err if err
      @_change event, item
  ###
  ###

  _change: (event, item) ->
    # override me

  ###
  ###

  bothWays: () ->
    # override me

  ###
  ###

  __transform: (method, value, next) ->
    utils.tryTransform @_transformer, method, value, next
