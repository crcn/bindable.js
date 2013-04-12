class CallChain
  
  ###
  ###

  __isCallChain: true

  ###
  ###

  constructor: (@_targetClass, methods) ->
    @_addMethods methods
    @_callChain = []

  ###
  ###

  createObject: () ->


    clazz = @_targetClass
    args  = arguments

    C = () ->
      clazz.apply(this, args)

    C.prototype = clazz.prototype

    obj = new C()

    for call in @_callChain
      obj = obj[call.method].apply(obj, call.args)

  ###
  ###

  copyId: (value) ->
    return @_copyId if not arguments.length
    @_copyId = value
    @


  ###
  ###

  callMethod: (method, args) ->
    @_callChain.push {
      method: method,
      args: args
    }
    @


  ###
  ###

  _addMethods: (methods) ->
    for method in methods
      @_addMethod method
    @

  ###
  ###

  _addMethod: (method) ->
    @[method] = () -> 
      @callMethod method, arguments




module.exports = class Builder

  ###
  ###

  constructor: (@_class, @_attach = @) ->
    @_createMethods()

  ###
  ###

  _createMethods: () ->

    @_methods = []

    # make all methods static - this creates a 
    for key of @_class.prototype
      continue if key.substr(0, 1) is "_"
      @_addMethod key

  ###
  ###

  _addMethod: (method) ->
    @_methods.push method
    @_attach[method] = () =>  
      new CallChain(@_class, @_methods).callMethod method, arguments
      