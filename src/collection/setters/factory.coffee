FnSetter = require("./fn")
ObjSetter = require("./object")
CollectionSetter = require("./collection")

module.exports = class
  
  ###
  ###

  createSetter: (binding, target) ->


    return null if not target

    # collection.bind(function(method, item, index) {})
    if typeof target is "function"
      return new FnSetter(binding, target)

    # collection.bind(collection2)
    else if target.__isCollection
      return new CollectionSetter(binding, target)

    # collection.bind({ insert: function(){}, remove: function(){} })
    else if target.insert or target.update or target.remove or target.replace
      return new ObjSetter(binding, target)


    return null