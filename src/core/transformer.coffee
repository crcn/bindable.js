module.exports = class

  ###
  ###

  constructor: (options) ->

    if typeof options is "function"
      options = {
        from: options,
        to: options
      }

    @options = options

  ###
  ###

  from: (value, next) -> @_transform "from", value, next

  ###
  ###

  to: (value, next) -> @_transform "to", value, next

  ###
  ###

  _transform: (method, value, next) ->
    transform = @options[method]

    return next(null, value) if not transform

    if transform.length is 1
      next(null, transform(value))
    else
      transform value, next

