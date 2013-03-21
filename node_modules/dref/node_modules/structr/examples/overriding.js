var structr = require("../");
var A = structr({
	"hello": function() {
		return "a";
	}
});
var B = structr(A, {
	"hello": function() {
		return "b";
	}
});

var C = structr(A, {
	"override hello": function() {
		return this._super() + "c";
	}
});


var a = new A(),
b = new B(),
c = new C();


console.log(a.hello());
console.log(b.hello());
console.log(c.hello());