var express = require('express');
const path = require("path");
var app = express();
const bodyParser = require("body-parser");

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

/* app.get('*', function(req,res) {
  res.sendFile(path.resolve('../build/resources/main/static/index.html'));
}); */

app.use(express.static('../build/resources/main/static/'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
