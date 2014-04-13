# Owlin Connector

## Installing
You can install the Owlin NodeJS API Connector with the Node Package Manger.
```
npm install owlin-connect
```

## Usage example
The foll__owlin__g code example will retrieve a list of articles matching an apple search. For other API calls, checkout the [Owlin API docs](https://github.com/owlin/owlin-apidocs).

```Javascript
const owlin = require('owlin-connect');

var owl = new owlin({
    email       : "richard@owlin.com",
    password    : "redacted"
});

owl.request({
    method : "get_articles",
    value : "filter:oxhgxsgqqdh0xnrciogb0xfwvafahqsc",
    args : {
        hits : 50,
        range : {
            epoch : { from : (new Date()/1000)-86400 }
        }
    }
}, function(err, data){
    console.log("got data from request method:");
    console.log(data);
})
```
