_        = require "underscore"
FnSetter = require "./fn"

module.exports = class extends require("./base")

  ###
  ###

  init: () ->

    _.defaults(@target, {
      insert : ((item) ->)
      remove : ((item) ->)
      reset  : ((item) ->)
    })


    @_setter = new FnSetter @binding, (method, item, index) =>
      @target[method].call @target, item, index

  ###
  ###

  now: () -> @_setter.now()


  ###
  ###

  _change: () -> @_setter._change.apply @_setter, arguments
