###
 global options
###

module.exports = 
  delay: -1
  computedDelay: if typeof window isnt "undefined" then 0 else -1
