utils = require "../../core/utils"
async = require "async"

module.exports = class 
  
  ###
  ###

  __isSetter: true
  
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
    if @_filter
      return unless @_filter item

    @_change event, @_transformer.to(item), oldItem

  ###
  ###

  _changeItems: (event, items, oldItems) ->

    if @_filter
      changed = items.filter @_filter
    else
      changed = items.concat()

    for item, i in changed
      changed[i] = @_transformer.to(item)

    @_change events, changed, oldItems




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
