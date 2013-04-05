


exports.get = (target, key, flatten = true) ->

  return if not target
  keyParts = if key then key.split "." else []
  ct = target


  for k, i in keyParts

    return if not ct

    # current target is bindable? pass the get along to it
    return ct.get(keyParts.slice(i).join(".")) if ct.__isBindable
    ct = ct[k]

  if flatten and ct and ct.__isBindable
    return ct.get()

  return ct


  
exports.set = (target, key, value) ->
  return if not target or not key

  keyParts = key.split(".")


  ct = target.data
  n = keyParts.length


  for k, i in keyParts

    if ct.__isBindable
      ct.set keyParts.slice(i).join("."), value
      return
    else
      if i is n-1
        ct[k] = value
        break
      else
        nv = ct[k]
        if not nv or (typeof nv isnt "object")
          nv = ct[k] = {}

        ct = nv






