"use strict";

import * as express from "express";
import {routes} from "./routes/index";

export function start(config: any): void {
    var app = express();
  
    // Static files
    app.use(express.static(__dirname + '/public'));
    
    // Define http routes
    routes(app, config, null);

    // Start Odata server
    config = config || {};
    config.http = config.http || {};
    config.http.port = config.http.port || process.env.PORT || 3000;
    app.listen(config.http.port, function() {
        console.log("Odata server started at port %d", config.http.port);
    });

}


