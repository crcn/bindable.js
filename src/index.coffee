
Binding = require "./object/binding"

exports.Object       = require "./object"
exports.Collection   = require "./collection"
exports.EventEmitter = require "./core/eventEmitter"
exports.computed     = require "./utils/computed"
exports.options      = require "./utils/options"

# beats circular dependency
Binding.Collection   = exports.Collection