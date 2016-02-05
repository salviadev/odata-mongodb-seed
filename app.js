"use strict";
var express = require("express");
//import * as routes from "./routes/index";
var app = express();
// Configuration
app.use(express.static(__dirname + '/public'));
app.listen(3000, function () {
    console.log("Demo Express server listening on port %d in %s mode", 3000, app.settings.env);
});
exports.App = app;
