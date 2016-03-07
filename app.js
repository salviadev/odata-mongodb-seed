/// <reference path="../node_modules/phoenix-utils/lib/definitions/phoenix-utils.d.ts" />
/// <reference path="../node_modules/phoenix-mongodb/lib/definitions/phoenix-mongodb.d.ts" />
/// <reference path="../node_modules/phoenix-odata/lib/definitions/phoenix-odata.d.ts" />
/// <reference path="../node_modules/phoenix-json-schema-tools/lib/definitions/phoenix-json-schema-tools.d.ts" />
"use strict";
const path = require('path');
const server = require('./server/server');
const phoenix_utils_1 = require('phoenix-utils');
const index_1 = require("./server/configuration/index");
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
