"use strict"
import * as server  from "./server/server";
let cfg = {
    http: {
        port: 3000
    }
};

server.start(cfg);