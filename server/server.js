"use strict";
var express = require("express");
//import * as routes from "./routes/index";
var app = express();
// Configuration
app.use(express.static(__dirname + '/public'));
function start(config) {
    config = config || {};
    config.http = config.http || {};
    config.http.port = config.http.port || 3000;
    app.listen(config.http.port, function () {
        console.log("Server listening on port %d in %s mode", config.http.port, app.settings.env);
    });
}
exports.start = start;
