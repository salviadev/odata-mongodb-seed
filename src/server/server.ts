"use strict";

import * as express from "express";
import {routes} from "./routes/index";


export function start(config: any): void {
    var app = express();

    // Configuration
    //static files
    app.use(express.static(__dirname + '/public'));
    //routes
    routes(app, config);

    config = config || {};
    config.http = config.http || {};
    config.http.port = config.http.port || process.env.PORT || 3000;
    app.listen(config.http.port, function() {
        console.log("Odata server started at port %d", config.http.port);
    });

}


