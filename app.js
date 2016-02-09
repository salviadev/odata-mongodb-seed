/// <reference path="../node_modules/phoenix-utils/lib/definitions/phoenix-utils.d.ts" />
"use strict";
var path = require('path');
var server = require('./server/server');
var phoenix_utils_1 = require('phoenix-utils');
var index_1 = require("./server/configuration/index");
phoenix_utils_1.json.loadFromFile(path.join(__dirname, 'config.json')).then(function (config) {
    let appManager = index_1.applicationManager(config);
    appManager.loadModel(path.join(__dirname, 'server', 'model')).then(function () {
        server.start(config);
    }).catch(function (ex) {
        console.log(ex);
        throw ex;
    });
}).catch(function (ex) {
    console.log(ex);
    throw ex;
});
