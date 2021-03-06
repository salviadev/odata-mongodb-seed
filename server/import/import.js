"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const path = require('path');
const util = require('util');
const pmongo = require('phoenix-mongodb');
const putils = require('phoenix-utils');
const index_1 = require("../configuration/index");
function dataFiles(schemas, dataPath, isCsv) {
    let promises = [];
    for (let schema of schemas) {
        let fn = path.join(dataPath, schema.name + (isCsv ? '.csv' : '.json'));
        promises.push(putils.fs.stat(fn, false));
        console.log(fn);
    }
    return new Promise((resolve, reject) => {
        Promise.all(promises).then(function (files) {
            let res = [];
            files.forEach(function (stats, index) {
                if (stats && stats.isFile()) {
                    console.log(stats);
                    res.push({ schema: schemas[index], fileName: path.join(dataPath, schemas[index].name + '.json') });
                }
            });
            resolve(res);
        }).catch(function (ex) {
            reject(ex);
        });
    });
}
function importFiles(settings, connections, files, options, tenantId) {
    let promises = [];
    for (let file of files) {
        promises.push(pmongo.schema.importCollectionFromFile(settings, connections, file.schema, file.fileName, options, tenantId));
    }
    return Promise.all(promises);
}
function initializeDatabase(isCsv) {
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
        let schemas = app.schemas();
        yield pmongo.schema.createCollections(app.settings.storage.connect, app.connections, schemas);
        let files = yield dataFiles(schemas, dataPath, isCsv);
        yield importFiles(app.settings.storage.connect, app.connections, files, {
            truncate: true,
            onImported: function (schema, lc) {
                console.log(util.format("%s - %d documents inserted.", schema.name, lc));
            }
        });
    });
}
initializeDatabase(false).then(function () {
    console.log("Success");
    process.exit(0);
}).catch(function (ex) {
    console.error(ex);
    process.exit(-1);
});
