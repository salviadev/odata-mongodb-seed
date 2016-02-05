"use strict";

import * as http from "http";
import * as url from "url";
import * as express from "express";
import * as bodyParser from "body-parser";


//import * as routes from "./routes/index";

var app = express();

// Configuration
app.use(express.static(__dirname + '/public'));



app.listen(3000, function(){
    console.log("Demo Express server listening on port %d in %s mode", 3000, app.settings.env);
});

export var App = app;
