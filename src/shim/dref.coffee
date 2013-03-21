module.exports = {
  test: (item) -> item.get && item.set
  get: (item, key) -> item.data[key] or item[key]
  set: (item, key, value) -> item.set key, value
}