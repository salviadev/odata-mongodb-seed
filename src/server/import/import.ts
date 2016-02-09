"use strict";

/// <reference path="../node_modules/phoenix-utils/lib/definitions/phoenix-utils.d.ts" />
"use strict";

import * as path from 'path';
import * as util from 'util';
import {json}  from 'phoenix-utils';
import {applicationManager} from "../configuration/index";





async function initializeDatabase(): Promise<void> {
    if (process.argv.length !== 4) {
        throw "Use node import applicatioName pathToData";
    }
    let applicationName = process.argv[2];
    let dataPath = process.argv[3];
    let pathToModel = path.join(__dirname, '..', '..', 'config.json');
    let config = await json.loadFromFile(pathToModel);
    let appManager = applicationManager(config);
    await appManager.loadModel(path.join(__dirname, '..', 'model'));
    let app = appManager.application(applicationName);
    if (!app)
        throw util.format('Application not found: "%s". Check config.json file.', applicationName); 
    //let db = 
}


initializeDatabase().then(function() {
   console.log("Success"); 
}).catch(function(ex) {
    console.error(ex);
});