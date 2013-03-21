### Features

- Ability to deep reference an object
- Ability to scan arrays, and return an array of values, e.g, `users.$.name`.


### Usage

```javascript

var dref = require("dref");

var target = [
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


console.log(dref.get(target, '$.name')); //["Craig", "Tim"]
console.log(dref.get(target, '$.location.city')); //["Minneapolis", "St. Paul"]
dref.set(target, '$.name', "BLAH");
console.log(dref.get(target, '$.name')); //["BLAH", "BLAH"]
```
