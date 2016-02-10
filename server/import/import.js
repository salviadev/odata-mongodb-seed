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
var pmongo = require('phoenix-mongodb');
var putils = require('phoenix-utils');
var index_1 = require("../configuration/index");
function dataFiles(schemas, dataPath) {
    let promises = [];
    for (let schema of schemas) {
        let fn = path.join(dataPath, schema.name + '.json');
        promises.push(putils.fs.stat(fn, false));
    }
    return new Promise((resolve, reject) => {
        Promise.all(promises).then(function (files) {
            let res = [];
            files.forEach(function (stats, index) {
                if (stats && stats.isFile()) {
                    res.push({ schema: schemas[index], fileName: path.join(dataPath, schemas[index].name + '.json') });
                }
            });
            resolve(res);
        }).catch(function (ex) {
            reject(ex);
        });
    });
}
function importFiles(db, files, options, tenantId) {
    let promises = [];
    for (let file of files) {
        promises.push(pmongo.schema.importCollectionFromFile(db, file.schema, file.fileName, options, tenantId));
    }
    return Promise.all(promises);
}
function initializeDatabase() {
    return __awaiter(this, void 0, Promise, function* () {
        if (process.argv.length !== 4) {
            throw util.format('Use node %s applicatioName path_to_data', 'import');
        }
        let applicationName = process.argv[2];
        let dataPath = path.join(process.cwd(), process.argv[3]);
        let stats = yield putils.fs.stat(dataPath, false);
        if (stats === null) {
            throw util.format('Data folder not found. "%s"', dataPath);
        }
        if (!stats.isDirectory()) {
            throw util.format('"%s" is not a directory', dataPath);
        }
        let pathToModel = path.join(__dirname, '..', '..', 'config.json');
        let config = yield putils.json.loadFromFile(pathToModel);
        let appManager = index_1.applicationManager(config);
        yield appManager.loadModel(path.join(__dirname, '..', 'model'));
        let app = appManager.application(applicationName);
        if (!app)
            throw util.format('Application not found: "%s". Check config.json file.', applicationName);
        if (!app.settings.storage || !app.settings.storage.connect)
            throw util.format('Invalid database config for "%s". Check config.json file.', applicationName);
        let db = yield pmongo.db.connect(pmongo.db.connectionString(app.settings.storage.connect));
        try {
            let schemas = app.schemas();
            yield pmongo.schema.createDatabase(db, schemas);
            let files = yield dataFiles(schemas, dataPath);
            yield importFiles(db, files, {
                insert: true,
                onImported: function (schema, lc) {
                    console.log(util.format("%s - %d documents inserted.", schema.name, lc));
                }
            });
        }
        finally {
            yield pmongo.db.close(db);
        }
        //let db = 
    });
}
initializeDatabase().then(function () {
    console.log("Success");
}).catch(function (ex) {
    console.error(ex);
});
