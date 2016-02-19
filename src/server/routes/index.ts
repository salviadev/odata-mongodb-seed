
"use strict";

import * as express from "express";
import {odataRoutes}  from "./odata/odata-routes";
import {uploadRoutes}  from "./odata/odata-import-routes";

export function routes(app: express.Express, config: any, authHandler: any): void {
    uploadRoutes(app, config, authHandler);
    odataRoutes(app, config, authHandler);
    
};