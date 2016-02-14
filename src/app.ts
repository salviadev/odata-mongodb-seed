/// <reference path="../node_modules/phoenix-utils/lib/definitions/phoenix-utils.d.ts" />
/// <reference path="../node_modules/phoenix-mongodb/lib/definitions/phoenix-mongodb.d.ts" />
/// <reference path="../node_modules/phoenix-odata/lib/definitions/phoenix-odata.d.ts" />
/// <reference path="../node_modules/phoenix-json-schema-tools/lib/definitions/phoenix-json-schema-tools.d.ts" />
"use strict";

import * as path from 'path';
import * as server  from './server/server';
import {json}  from 'phoenix-utils';
import {applicationManager} from "./server/configuration/index";

json.loadFromFile(path.join(__dirname, 'config.json')).then(function(config) {
    let appManager = applicationManager(config);

    appManager.loadModel(path.join(__dirname, 'server', 'model')).then(function() {
        server.start(config);
    }).catch(function(ex) {
        console.log(ex);
        throw ex;
    });
}).catch(function(ex) {
    console.log(ex);
    throw ex;
});
