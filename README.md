## Bindable


### Objects

```javascript
var Bindable = require("bindable").Object;

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
```


### Collections