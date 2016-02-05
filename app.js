"use strict";
var server = require("./server/server");
let cfg = {
    http: {
        port: 3000
    }
};
server.start(cfg);
