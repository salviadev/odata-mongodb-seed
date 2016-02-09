"use strict";

import * as  path  from 'path';
import * as  express  from 'express';
import {http, odata}  from 'phoenix-utils';

import {parseOdataUri}  from './odata-url-parser';
import {applicationManager}  from '../../configuration/index';



export function odataRoutes(app: express.Express, config, authHandler): void {
    app.get('/odata/*', function(req, res, next) {
        // Parse url 
        let odataUri = parseOdataUri(req.url, "GET");
        if (odataUri.error) {
            http.error(res, odataUri.error.message, odataUri.error.status);
            return;
        }
        // Execute odata get
        if (odataUri.application === '*') {
            res.status(200).json(odata.queryResult(applicationManager().applications()));
        } else if (!odataUri.entity) {
            // list entities
            http.noi(res, 'List of entities: not implemented');
        } else {
                
        }


       /* odataExecutor(odataUrl, function(err, odataResult) {
            if (err) {
                return res.status(err.status || 500).json({ message: err.message });
            }
            if (odataResult == null)
                odataResult = {};
            res.status(odataResult.status || 200).json(odataResult);
        });
        */  

    });

}
