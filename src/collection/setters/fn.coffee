
module.exports = class extends require("./base")
  
  ###
  ###

  init: () ->
    super()
    
  ###
  ###

  now: () -> 
    return if @_initialized
    @_initialized = true
    #for item, i in @binding._from.source()
    #  @change "insert", item
      
  ###
  ###

  _change: (method, item, oldItems) ->
    @target method, item, oldItems
