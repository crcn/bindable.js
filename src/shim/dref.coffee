module.exports = {
  test: (item) -> item.get && item.set
  get: (item, key) -> 
    result = item.data[key]
    if (result is null) or (result is undefined)
      result = item[key]
    result
  set: (item, key, value) -> 
    item.set key, value
}