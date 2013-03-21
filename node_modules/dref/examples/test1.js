var dref = require('../');


/*var target = {
	name: "Craig",
	location: {
		city: "Minneapolis",
		state: "Minnesota"
	}
};


console.log(dref.get(target, "name"));
console.log(dref.get(target, "location.city"));
dref.set(target, "location.city", "St. Paul");
console.log(dref.get(target, "location.city"));*/


target = [
	{
		name: "Craig", 
		location: {
			city: "minneapolis"
		}
	},
	{
		name: "Tim", 
		location: {
			city: "St. Paul"
		}
	}
];


console.log(dref.get(target, '$.name'));
console.log(dref.get(target, 'name'));
console.log(dref.get(target, '$.location.city'));
dref.set(target, '$.name', "BLAH");
console.log(dref.get(target, '$.name', "BLAH"));