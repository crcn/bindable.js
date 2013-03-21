var _gss = [];

/**
 */

var _gs = function(context) {
	for(var i = _gss.length; i--;) {
		var gs = _gss[i];
		if(gs.test(context)) {
			return gs;
		}
	}
}

/**
 */

var _length = function(context) {
	var gs = _gs(context);

	return gs ? gs.length(context) : context.length;
}


/**
 */

var _get = function(context, key) {

	var gs = _gs(context);

	return gs ? gs.get(context, key) : context[key];
}


/**
 */

var _set = function(context, key, value) {

	var gs = _gs(context);

	return gs ? gs.set(context, key, value) : (context[key] = value);
}

/**
 * finds references
 */

var _findValues = function(keyParts, target, create, index, values) {

	if(!values) {
		keyParts = (keyParts instanceof Array ? keyParts : keyParts.split(".")).filter(function(part) {
			return !!part.length;
		})
		values = [];
		index = 0;
	}

	var ct, j, kp, i = index, n = keyParts.length, pt = target;


	for(;i < n; i++) {
		kp = keyParts[i];
		ct = _get(pt, kp);


		if(kp == '$') {

			for(j = _length(pt); j--;) {
				_findValues(keyParts, _get(pt, j), create, i + 1, values);
			}
			return values;
		} else
		if(ct == undefined || ct == null) {
			if(!create) return values;
			_set(pt, kp, { });
			ct = _get(pt, kp);
		}

		pt = ct;
	}

	if(ct) {
		values.push(ct);
	} else {
		values.push(pt);
	}

	return values;
}


/**
 */

var getValue = function(target, key) {
	key = String(key);
	var values =  _findValues(key, target);

	return key.indexOf('.$.') == -1 ? values[0] : values;
}

/**
 */

var setValue = function(target, key, newValue) {
	key = String(key);
	var keyParts = key.split("."),
	keySet = keyParts.pop();

	if(keySet == '$') {
		keySet = keyParts.pop();
	}

	var values = _findValues(keyParts, target, true);


	for(var i = values.length; i--;) {
		// values[i][keySet] = newValue;
		_set(values[i], keySet, newValue);
	}

}


exports.get = getValue;
exports.set = setValue;
exports.use = function(gs) {
	_gss.push(gs);
}


