
"use strict";

import * as express from "express";
import {odataRoutes}  from "./odata/odata-routes";

export function routes(app: express.Express, config: any, authHandler: any): void {
    odataRoutes(app, config, authHandler);
};