ObjSetter = require "./object"

module.exports = class extends require("./base")
  
  ###
  ###

  init: () ->
    super()

    @_setter = new ObjSetter @binding, methods = {
      insert: (item) =>


        # id might have changed - persist it.
        if @binding._copyId
          @target._id @binding._from._id()

        if ~@target.indexOf item
          methods.update item
        else
          @target.push(item)

      update: (item) =>
        @target.update item

      reset: (items, oldItems) =>
        for item in oldItems  
          @target.remove item
          
        for item in items
          methods.insert item

      remove: (item) =>
        index = @target.indexOf item
        if ~index
          @target.splice(index, 1)

    }

  ###
  ###

  now: () -> @_setter.now()

  ###
  ###

  _change: () -> @_setter._change.apply(@_setter, arguments)

  ###
  ###

  bothWays: () ->
    throw new Error("cannot bind both ways yet")

