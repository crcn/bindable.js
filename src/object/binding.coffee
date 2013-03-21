
###
 Glues stuff together
###

module.exports = class
  
  ###
  ###

  constructor: (@from, @property) ->
    @_limit = -1

  
  ###
   binds to a target
  ###

  to: (target, propertyOrListener) ->


  ###
   runs the binding just once
  ###

  once: () -> @limit 1


  ###
   limits the number of times the binding can be called
  ###

  limit: (count) -> 
    @_limit = count
    @


  ###  
   makes the binding go both ways.
  ###

  bothWays: () ->
   @

  ###
   removes the binding
  ###

  dispose: () ->

  ###
   triggers the binding *if* it exists
  ###

  trigger: () ->
    @


