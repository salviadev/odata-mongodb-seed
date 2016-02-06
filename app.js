/// <reference path="../node_modules/phoenix-utils/lib/definitions/phoenix-utils.d.ts" />
"use strict";
var path = require('path');
var server = require('./server/server');
var phoenix_utils_1 = require('phoenix-utils');
phoenix_utils_1.json.loadFromFile(path.join(__dirname, 'config.json')).then(function (config) {
    server.start(config);
}).catch(function (ex) {
    throw ex;
});
