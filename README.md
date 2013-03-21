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

item.set("location.zip", "94102"); //triggers the binding
```


### Collections