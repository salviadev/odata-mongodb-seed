"use strict";

import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';
import * as mongodb from 'mongodb';
import * as pmongo from 'phoenix-mongodb';
import * as putils from 'phoenix-utils';
import {applicationManager} from "../configuration/index";



function dataFiles(schemas: any[], dataPath: string, isCsv: boolean): Promise<any[]> {
    let promises = [];
    for (let schema of schemas) {
        let fn = path.join(dataPath, schema.name + (isCsv ? '.csv': '.json'));
        promises.push(putils.fs.stat(fn, false));
    }

    return new Promise<any[]>((resolve, reject) => {
        Promise.all(promises).then(function(files) {
            let res = [];
            files.forEach(function(stats: fs.Stats, index) {
                if (stats && stats.isFile()) {
                    res.push({ schema: schemas[index], fileName: path.join(dataPath, schemas[index].name +  '.json') })
                }
            });
            resolve(res);

        }).catch(function(ex) {
            reject(ex);
        });
    });

}

function importFiles(settings: any, connections: any, files: any[], options: any, tenantId?: number): Promise<any[]> {
    let promises = [];
    for (let file of files) {
        promises.push(pmongo.schema.importCollectionFromFile(settings, connections, file.schema, file.fileName, options, tenantId));
    }

    return Promise.all(promises);
}



async function initializeDatabase(isCsv: boolean): Promise<void> {
    if (process.argv.length !== 4) {
        throw util.format('Use node %s applicatioName path_to_data', 'import');
    }
    let applicationName = process.argv[2];
    let dataPath = path.join(process.cwd(), process.argv[3]);
    let stats = await putils.fs.stat(dataPath, false);
    if (stats === null) {
        throw util.format('Data folder not found. "%s"', dataPath);
    }
    if (!stats.isDirectory()) {
        throw util.format('"%s" is not a directory', dataPath);
    }
    let pathToModel = path.join(__dirname, '..', '..', 'config.json');
    let config = await putils.json.loadFromFile(pathToModel);
    let appManager = applicationManager(config);
    await appManager.loadModel(path.join(__dirname, '..', 'model'));
    let app = appManager.application(applicationName);
    if (!app)
        throw util.format('Application not found: "%s". Check config.json file.', applicationName);
    if (!app.settings.storage || !app.settings.storage.connect)
        throw util.format('Invalid database config for "%s". Check config.json file.', applicationName);
    let schemas = app.schemas();
    await pmongo.schema.createCollections(app.settings.storage.connect, app.connections, schemas);

    let files = await dataFiles(schemas, dataPath, isCsv);
    await importFiles(app.settings.storage.connect, app.connections, files,
        {
            truncate: true,
            onImported: function(schema, lc) {
                console.log(util.format("%s - %d documents inserted.", schema.name, lc));
            }
        });

}


initializeDatabase(false).then(function() {
    console.log("Success");
    process.exit(0);
}).catch(function(ex) {
    console.error(ex);
    process.exit(-1);
});