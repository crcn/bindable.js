ObjSetter = require("./object")


module.exports = class extends require("./base")
  
  ###
  ###

  init: () ->
    super()
    @_setter = new ObjSetter @binding, methods = {
      insert: (item) =>

        if ~@target.indexOf item
          methods.update item, index
        else
          @target.push(item)

      update: (item, index) =>
        @target.update item
      remove: (item) =>
        index = @target.indexOf item

        if ~index
          @target.splice(index, 1)

    }

  ###
  ###

  _change: () -> @_setter._change.apply(@_setter, arguments)


  ###
  ###

  bothWays: () ->
    throw new Error("cannot bind both ways yet")

