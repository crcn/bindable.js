FnSetter = require("./fn")
BindableSetter = require("./bindable")

module.exports = class
  
  ###
  ###

  createSetter: (binding, target, property) ->

    to           = null
    toProperty   = null
    callback     = null

    # this will happen if the "to" parameter is not provided in bindable.bind("property")
    return null if not target and not property

    #bindable.bind("property").to(model, "property")
    if typeof property is "string"
      to = target
      toProperty = property

    #bindable.bind("property").to("property2")
    else if typeof target is "string" 
      to = binding.from
      toProperty = target

    # bindable.bind("property").to(function() { })
    # bindable.bind("property", function(){ })
    else if typeof target is "function"
      callback = target

    # binding.bind("property", binding)
    else if typeof target is "object" and target and target.__isBinding
      throw new Error "Cannot bind to a binding."
      

    # is it a function?
    if callback
      return new FnSetter binding, callback
    #else if to and to.to
      #return new BindingSetter binding, to
    else if to and toProperty
      return new BindableSetter binding, to, toProperty


    return null