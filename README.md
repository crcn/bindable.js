## Bindable


### Objects

```javascript
var Bindable = require("bindable");

var item = new Bindable({
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
  
}).limit(5)

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