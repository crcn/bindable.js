


exports.get = (bindable, context, keyParts, flatten = true) ->

  return context if not context

  unless keyParts
    keyParts = []

  if typeof keyParts is "string"
    keyParts = keyParts.split(".")

  ct = context

  for k, i in keyParts

    return if not ct

    # current context is bindable? pass the get along to it
    return ct.get(keyParts.slice(i).join(".")) if ct.__isBindable and ct isnt bindable
    ct = ct[k]

  if flatten and ct and ct.__isBindable
    return ct.get()

  return ct
 

  
exports.set = (bindable, key, value) ->
  keyParts = key.split(".")

  n = keyParts.length
  ct = bindable.__context

  for k, i in keyParts

    # context can be self
    if ct.__isBindable and ct isnt bindable
      return ct.set keyParts.slice(i).join("."), value
    else

      if i is n-1
        return false if ct[k] is value
        ct[k] = value
        return true
      else
        nv = ct[k]
        if not nv or (typeof nv isnt "object")
          nv = ct[k] = {}

        ct = nv






