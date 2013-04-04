_firstTarget = (target, keyParts, set) ->

  currentTarget = target

  firstKey = keyParts.shift()

  if target.__isBindable
    currentTarget = target.data
    ct = currentTarget[firstKey]

    # ct might be 0
    if (ct is undefined) or (ct is null)
      ct = target[firstKey]


  else
    ct = currentTarget[firstKey]

  
  if set and not ct
    ct = currentTarget[firstKey] = {}

  ct




exports.get = (target, key) ->

  return if not target or not key

  ct = _firstTarget target, keyParts = key.split "."

  for key, i in keyParts

    return if not ct

    # current target is bindable? pass the get along to it
    return ct.get(keyParts.slice(i).join(".")) if ct.__isBindable
    ct = ct[key]

  return ct


  
exports.set = (target, key, value) ->
  return if not target or not key

  keyParts = key.split(".")

  if keyParts.length is 1
    target.data[keyParts[0]] = value
    return

  ct = target.data
  n = keyParts.length


  for i in [0..n]
    k = keyParts[i]

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






