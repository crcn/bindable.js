# Bindable.js

Incredibly flexible bi-directional data binding library for `objects`, and `collections`. 

## Projects using bindable.js

- [Paperclip.js](/classdojo/paperclip.js) - data-bindable templating engine.
- [Linen.js](/classdojo/linen.js) - API library
- [Sherpa.js](/classdojo/sherpa.js) - online tours library
- [Mojo.js](/classdojo/mojo.js) - javascript framework.
- [ECTwo](/crcn/node-ectwo)
- [cortado](/crcn/cortado) - full integration testing framework. 


## BindableObject Example

```javascript
var BindableObject = require("bindable").Object;

var item = new BindableObject({
  name: "craig",
  last: "condon",
  location: {
    city: "San Francisco"
  }
});

item.bind("location.zip", function(value) {
  
}).now();

//triggers the binding
item.set("location.zip", "94102"); 



//bind location.zip to another property in the model, and do it only once
item.bind("location.zip", "zip").once().now();

//bind location.zip to another object, and make it go both ways!
item.bind("location.zip").to(anotherModel, "location.zip").bothWays().now();

//chain to multiple items, and limit it!
item.bind("location.zip").to("property").to("anotherProperty").to(function(value) {
  
}).limit(5).now();

item.bind({
  property: "location.zip",
  limit: 5,
  to: "anotherProperty",
  now: true
})

//you can even bind to values by setting a binding
anotherModel.set("location.zip", item.bind("location.zip"));

//you can also transform data as it's being bound
item.bind("name").map(function(name) {
  return name.toUpperCase()
}).to("name2").now();

```

## BindableCollection Example

```javascript
var collection = new bindable.Collection([{ name: "craig" }, { name: "sam" }, { name: "liam" }]),
collection2 = new bindable.Collection();

//binding to another collection, and transform that value into something else
collection.bind().map(function(item) {
  return new BindableObject(item);
}).to(collection2);

//binding to a collection with a filter
collection.bind().filter({ name: {$nin: ["craig", "liam"] }}).to(collection2).now();


var source = [];

collection.bind(function(method, item, index) {
  switch(method) {
    case "insert": 
      source.splice(index, 0, item);
    break;
    case "update":
    case "replace":
      source.splice(index, 1, item);
    break;
    case "remove":
      source.splice(index, 1);
    break;
  }
});
```

## Iteration helper

```javascript
var jake = new bindable.Object({
  name: "jake",
  age: 12
});

var sam = new bindable.Object({
  name: "sam",
  age: 22
});

var craig = new bindable.Object({
  name: "craig",
  age: 23
});

var liam = new bindable.Object({
  name: "liam",
  friends: [jake, sam, craig],
  getFriendsOlderThan20: bindable.computed("friends.@forEach.age", function(next) {
    this.get("friends").filter(function(friend) {
      return friend.get("age") > 20;
    }).forEach(next);
  })
});


liam.bind("@getFriendsOlderThan20.name").to(function(friendsOlderThan20) {
  //[sam, craig]
}).now();

jake.set("age", 22);

//callback friendsOlderThan20 = [sam, craig, jake]
```


## Computed Properties


```javascript
var notification = new bindable.Object({
  message: "hello",
  read: false
}),
notification2 = new bindable.Object({
  message: "hello 2",
  read: true
});

var notifications = new bindable.Collection([notification, notification2]);

//bind the number of unread notifications to numUnreadNotifications
notifications.bind("@each.read").map(function(readNotifications) {
  return readNotifications.filter(function(isRead) {
    return !isRead;
  }).length;
}).to("numUnreadNotifications").now();

console.log(notifications.get("numUnreadNotifications")); //1

for(var i = notifications.length(); i--;) {
  notifications.at(i).set("read", true);
}
console.log(notifications.get("numUnreadNotifications")); //0

```

## Add some sugar...

You can also compute properties by watching multiple values. For instance:

```javascript

var person = new bindable.Object({
  firstName: "John",
  lastName: "Doe"
});

person.bind("firstName, lastName").map({
  to: function(firstName, lastName) {
    return [firstName, lastName].join(" ");
  },
  from: function(fullName) {
    return String(fullName).split(" ");
  }
}).to("fullName").bothWays().now();

console.log(person.get("fullName")); //John Doe
person.set("fullName", "Jake Anderson"); 
console.log(person.get("firstName"), person.get("lastName")); //Jake Anderson
```


## API


### value bindable.get(property)

Returns a property on the bindable object

```javascript
var bindable = new bindable.Object({ city: { name: "SF" } });

console.log(bindable.get("city.name")); // SF
```

### bindable.set(property, value)

Sets a value to the bindable object

```javascript
var obj = new bindable.Object();
bindable.set("city.name", "sf");
console.log(obj.get("city.name")); // SF
```

### bindable.has(property)

Returns true if the bindable object has a given property

```javascript
var obj = new bindable.Object({ count: 0, male: false, name: "craig" });

console.log(obj.has("count")); // true
console.log(obj.has("male")); // true
console.log(obj.has("name")); // true
console.log(obj.has("city")); // false
```

### Object bindable.context()

returns the context of the bindable object.

```javascript
var context = {};
var obj     = new bindable.Object(context);

console.log(obj.context() == context); // true
```

### bindable.dispose()

Emits a `dispose` event, destroying all data-bindings and listeners on the given bindable object.

```javascript
var obj = new bindable.Object({ name: "craig" });

obj.bind("name").to("name2").now();

console.log(obj.get("name2")); // craig

obj.dispose();

obj.set("name", "abba");
console.log(obj.get("name2")); // craig
```

### binding bindable.bind(from [, to])

Creates a new binding object.

```javascript
var obj = new bindable.Object({ name: "craig" });

//bind to name2
obj.bind("name", "name2").now();

//same as above, different style.
obj.bind("name").to("name2").now();
```

### binding.to(targetOrFnOrProperty [, property])

Binds to another object, or property.

```javascript
var obj = new bindable.Object(),
obj2    = new bindable.Object();

obj.bind("name").to(obj2, "name").now();
obj.bind("name").to("name2").now();

obj.set("name", "craig");
console.log(obj2.get("name")); // craig
console.log(obj.get("name2")); // craig
```

Binding to a function:

```javascript
var obj = new bindable.Object();

//triggered after setting name
obj.bind("name").to(function (value, oldValue) {
  console.log(value); // craig
}).now();

obj.set("name", "craig"); // craig
```

You can also chan `to` together:

```javascript
var obj = new bindable.Object();
obj.bind("name").to(function(value, oldValue) {
  console.log(value); // craig
}).to("name2").now();

obj.set("name", "craig");
console.log(obj.get("name2")); // craig
```

### binding.now()

Executes the binding now. For example:

```javascript
var person = new bindable.Object({ name: "craig" });

//only executes on change
person.bind("name").to("name2");

//executes now, name must be present.
person.bind("name").to("name3").now();

console.log(person.get("name2")); // undefined
console.log(person.get("name3")); // craig

person.set("name", "john"); 

console.log(person.get("name2")); // john
console.log(person.get("name3")); // john
```

### binding.map(options)

Transforms a value:

```javascript
var person = new bindable.Object({ firstName: "craig", lastName: "condon" });

//map TO fullName
person.bind("firstName, lastName").map(function(firstName, lastName) {
  return [firstName, lastName].join(" ")
}).to("fullName").now();

console.log(person.get("fullName")); // craig condon
```

You can also map from another value:

```javascript

var person = new bindable.Object({ firstName: "craig", lastName: "condon" });

//map TO fullName
person.bind("firstName, lastName").map({
  to: function(firstName, lastName) {
    return [firstName, lastName].join(" ")
  },
  from: function(fullName) {
    fullName.split(" ");
  }
}).to("fullName").bothWays().now();

console.log(person.get("fullName")); // craig condon

person.set("fullName", "john anderson");

console.log(person.get("firstName")); // john
console.log(person.get("lastName")); // anderson

```

### binding.bothWays()

binds properties the other way around.

```javascript
```

