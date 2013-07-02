utils = require "../../core/utils"
async = require "async"

module.exports = class 
  
  ###
  ###

  constructor: (@binding, @target) ->
    @init()

  ###
  ###

  init: () ->
    # override me

  ###
  ###

  now: () -> 
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
    @_change event, item, oldItem

  ###
  ###

  _changeItems: (event, items, oldItems) ->

    ###
    if @_filter
      changed = items.filter @_filter
    else
      changed = items.concat()

    for item, i in changed
      changed[i] = @__transform "to", item

    @_change events, changed, oldItems
    ###


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

  __transform: (method, value) ->
    utils.tryTransform @_transformer, method, [value]
