"use strict";
var express = require("express");
var index_1 = require("./routes/index");
function start(config) {
    var app = express();
    // Configuration
    //static files
    app.use(express.static(__dirname + '/public'));
    //routes
    index_1.routes(app, config);
    config = config || {};
    config.http = config.http || {};
    config.http.port = config.http.port || process.env.PORT || 3000;
    app.listen(config.http.port, function () {
        console.log("Odata server started at port %d", config.http.port);
    });
}
exports.start = start;
