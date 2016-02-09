"use strict";
/// <reference path="../node_modules/phoenix-utils/lib/definitions/phoenix-utils.d.ts" />
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
var util = require('util');
var phoenix_utils_1 = require('phoenix-utils');
var index_1 = require("../configuration/index");
function initializeDatabase() {
    return __awaiter(this, void 0, Promise, function* () {
        if (process.argv.length !== 4) {
            throw "Use node import applicatioName pathToData";
        }
        let applicationName = process.argv[2];
        let dataPath = process.argv[3];
        let pathToModel = path.join(__dirname, '..', '..', 'config.json');
        let config = yield phoenix_utils_1.json.loadFromFile(pathToModel);
        let appManager = index_1.applicationManager(config);
        yield appManager.loadModel(path.join(__dirname, '..', 'model'));
        let app = appManager.application(applicationName);
        if (!app)
            throw util.format('Application not found: "%s"', applicationName);
        //let db = 
    });
}
initializeDatabase().then(function () {
    console.log("Success");
}).catch(function (ex) {
    console.error(ex);
});
