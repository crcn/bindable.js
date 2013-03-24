

module.exports = class extends require("./base")
  
  ###
  ###

  init: () ->
    super()

    # initial hydration
    for item, i in @binding._from.source()
      @change "insert", item
  ###
  ###

  _change: (method, item) ->
    @target method, item
