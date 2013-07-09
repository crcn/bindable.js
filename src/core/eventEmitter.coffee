events     = require "events"
disposable = require "disposable"

module.exports = class EventEmitter extends events.EventEmitter
  
  ###
  ###

  on: (key, listener) ->

    disposables = disposable.create()

    # ability to have multiple listeners as key
    if arguments.length is 1
      listeners = key
      for k of listeners  
        disposables.add @on k, listeners[k]
      return disposables


    keys = []

    if typeof key is "string"
      keys = key.split " "
    else
      keys = key


    # ability to specify multiple keys for a given listener
    keys.forEach (key) =>
      super key, listener

      disposables.add () =>
        @off key, listener
      
    disposables

  ###
  ###

  once: (key, listener) ->
    oldListener = listener

    disp = @on key, () ->
      disp.dispose()
      oldListener.apply this, arguments

    disp.target = @

    disp

  ###
  ###

  off: (key, listener) -> @removeListener key, listener