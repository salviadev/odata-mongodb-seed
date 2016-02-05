"use strict";

import * as http from "http";
import * as url from "url";
import * as express from "express";
import * as bodyParser from "body-parser";


//import * as routes from "./routes/index";

var app = express();

// Configuration
app.use(express.static(__dirname + '/public'));

export function start(config: any): void {
    config  = config || {}; 
    config.http = config.http || {};
    config.http.port = config.http.port || 3000;   
    app.listen(config.http.port, function() {
        console.log("Server listening on port %d in %s mode", config.http.port, app.settings.env);
    });

}


