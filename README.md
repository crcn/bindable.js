## Bindable


### Objects

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
  
});

//triggers the binding
item.set("location.zip", "94102"); 



//bind location.zip to another property in the model, and do it only once
item.bind("location.zip", "zip").once()

//bind location.zip to another object, and make it go both ways!
item.bind("location.zip").to(anotherModel, "location.zip").bothWays();

//chain to multiple items, and limit it!
item.bind("location.zip").to("property").to("anotherProperty").to(function(value) {
  
}).limit(5);

item.bind({
  property: "location.zip",
  limit: 5,
  to: "anotherProperty"
})

//you can even bind to values by setting a binding
anotherModel.set("location.zip", item.bind("location.zip"));

//you can also transform data as it's being bound
item.bind("name").transform(function(name) {
  return name.toUpperCase()
}).to("name2");

```

Defining bindings in classes

```coffeescript

Bindable = require("bindable");

class Person extends bindable

  name: "craig",

  name2: Bindable.from("name")

```


### Collections

```javascript
var collection = new bindable.Collection([{ name: "craig" }, { name: "sam" }, { name: "liam" }]),
collection2 = new bindable.Collection();

//binding to another collection, and transform that value into something else
collection.bind().transform(function(item) {
  return new BindableObject(item);
}).to(collection2);

//binding to a collection with a filter
collection.bind().filter({ name: {$nin: ["craig", "liam"] }}).to(collection2);


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