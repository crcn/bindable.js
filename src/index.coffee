Binding = require("./object/binding")


exports.Object       = require "./object"
exports.Collection   = require "./collection"
exports.EventEmitter = require "./core/eventEmitter"

# beats circular dependency
Binding.Collection   = exports.Collection