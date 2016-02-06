/// <reference path="../node_modules/phoenix-utils/lib/definitions/phoenix-utils.d.ts" />
"use strict";

import * as path from 'path';
import * as server  from './server/server';
import {json}  from 'phoenix-utils';

json.loadFromFile(path.join(__dirname, 'config.json')).then(function(config) {
    server.start(config);
}).catch(function(ex) {
    throw ex;
});
