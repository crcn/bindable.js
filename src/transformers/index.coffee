tq = require "tq"
Transformer = require "./transformer"
EventEmitter = require "../core/eventEmitter"
flat = require("flat")


module.exports = class extends EventEmitter

  ###
  ###

  constructor: (@bindable) ->  
    super()

  ###
  ###
  

  set: (key, value) ->
    target = { currentValue: value }
    n = @emit key, target
    target.currentValue


  ###
  ###

  use: (key, transformer) -> 

    if arguments.length is 1
      transformer = key 
      key = undefined


    if not key
      event = "**"
    else
      keyParts = key.split(".")

      # start from the ROOT property
      event = "#{keyParts.shift()}.**"

    transformer = new Transformer transformer


    @on event, (target) => 
      if not key or (@bindable.get(key) isnt target.currentValue)
        target.currentValue = transformer.set target.currentValue


    transformer


