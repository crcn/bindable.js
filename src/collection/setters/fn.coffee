
module.exports = class extends require("./base")
  
  ###
  ###

  init: () ->
    super()

    # initial hydration
    @change "reset", @binding._from.source()
    #for item, i in @binding._from.source()
    #  @change "insert", item
      
  ###
  ###

  _change: (method, item) ->
    @target method, item
