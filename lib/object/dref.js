exports.get = function (bindable, context, keyParts, flatten) {

  if (arguments.length === 3) {
    flatten = true;
  }

  if (!keyParts) {
    keyParts = [];
  }

  if (typeof keyParts === "string") {
    keyParts = keyParts.split(".");
  }

  var ct = context;

  for (var i = 0, n = keyParts.length; i < n; i++) {
    var k = keyParts[i];

    if (!ct) return;


    // current context is bindable? pass along
    if (ct.__isBindable && ct !== bindable) {
      return ct.get(keyParts.slice(i).join("."));
    }
    ct = ct[k];
  }

  if (flatten && ct && ct.__isBindable) {
    return ct.get();
  }

  return ct;
}


exports.set = function (bindable, key, value) {

  var keyParts = key.split("."),
  n = keyParts.length,
  ct = bindable.__context,
  nv;

  for (var i = 0, n = keyParts.length; i < n; i++) {
    var k = keyParts[i];

    if (ct.__isBindable && ct !== bindable) {
      return ct.set(keyParts.slice(i).join("."), value);
    } else {
      if (i === n - 1) {
        if (ct[k] === value) {
          return false; 
        }
        ct[k] = value;
        return true;
      } else {
        nv = ct[k];
        if (!nv || (typeof nv !== "object")) {
          nv = ct[k] = {};
        }
        ct = nv;
      }
    }
  }
}