const express = require('express');
const path = require('path');
var app = new express();
var port = process.env.PORT || 3000;

// Define the port to run on
app.set('port', port);
app.use('/', express.static(path.join(__dirname, 'public')));
app.listen(port,function() {
  console.log("App running on "+ port);
});
