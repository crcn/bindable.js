utils = require "../../core/utils"

module.exports = class 
  
  ###
  ###

  constructor: (@binding, @target) ->
    @_transformer = binding.transform()
    @_filter = binding.filter()
    @init()

  ###
  ###

  init: () ->
    # override me

  ###
  ###

  dispose: () ->
  
  ###
  ###

  change: (event, item) ->

    if @_filter
      return if not @_filter item

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
