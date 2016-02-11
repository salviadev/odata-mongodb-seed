/// <reference path="../node_modules/phoenix-utils/lib/definitions/phoenix-utils.d.ts" />
/// <reference path="../node_modules/phoenix-mongodb/lib/definitions/phoenix-mongodb.d.ts" />
/// <reference path="../node_modules/phoenix-odata/lib/definitions/phoenix-odata.d.ts" />
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, Promise, generator) {
    return new Promise(function (resolve, reject) {
        generator = generator.call(thisArg, _arguments);
        function cast(value) { return value instanceof Promise && value.constructor === Promise ? value : new Promise(function (resolve) { resolve(value); }); }
        function onfulfill(value) { try { step("next", value); } catch (e) { reject(e); } }
        function onreject(value) { try { step("throw", value); } catch (e) { reject(e); } }
        function step(verb, value) {
            var result = generator[verb](value);
            result.done ? resolve(result.value) : cast(result.value).then(onfulfill, onreject);
        }
        step("next", void 0);
    });
};
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
