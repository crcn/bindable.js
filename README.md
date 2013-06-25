## Bindable

Incredibly flexible bi-directional data binding library for `objects`, and `collections`. 

## Projects using bindable.js

- [paperclip.js](/classdojo/paperclip.js) - data-bindable templating engine.
- [linen.js](/classdojo/linen.js) - API library
- [sherpa.js](/classdojo/sherpa.js) - online tours library

### Objects Example

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

### Collections Example

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

### Iteration helper

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


### Computed Properties


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

#### Add some sugar...

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


### API
