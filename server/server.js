"use strict";
var express = require("express");
var index_1 = require("./routes/index");
function start(config) {
    var app = express();
    // Static files
    app.use(express.static(__dirname + '/public'));
    // Define http routes
    index_1.routes(app, config, null);
    // Start Odata server
    config = config || {};
    config.http = config.http || {};
    config.http.port = config.http.port || process.env.PORT || 3000;
    app.listen(config.http.port, function () {
        console.log("Odata server started at port %d", config.http.port);
    });
}
exports.start = start;
