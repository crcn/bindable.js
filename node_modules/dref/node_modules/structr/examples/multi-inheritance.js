var structr = require("../");


var A = structr({
	"a": function() {
		console.log("a")
	}
});

var B = structr({
	"b": function() {
		console.log("b")
	}
});

var C = structr(A, B, {
	"c": function() {
		console.log("c")
	}
});

var c = new C();
c.a();
c.b();
c.c();



