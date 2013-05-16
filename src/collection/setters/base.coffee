utils = require "../../core/utils"
async = require "async"

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

  change: (event, item, oldItem) ->

    if event is "reset"
      @_changeItems event, item, oldItem
    else
      @_changeItem event, item, oldItem


  ###
  ###

  _changeItem: (event, item, oldItem) ->
    if @_filter
      return if not @_filter item

    @__transform "to", item, (err, item) =>
      throw err if err
      @_change event, item, oldItem

  ###
  ###

  _changeItems: (event, items, oldItems) ->
    if @_filter
      changed = items.filter @_filter
    else
      changed = items

    async.map changed, ((item, next) =>
      @__transform "to", item, (err, item) =>
        throw err if err
        next null, item
    ), (err, items) => 
      throw err if err
      @_change event, items, oldItems

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
