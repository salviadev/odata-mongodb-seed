"use strict";

import * as  path  from 'path';
import * as  express  from 'express';
import {parseOdataUri}  from './odata-url-parser';


export function odataRoutes(app: express.Express, config, authHandler): void {
    app.get('/odata/*', authHandler, function(req, res, next) {
        // Parse url 
        let odataUri = parseOdataUri(req.url, "GET");
        if (odataUri.error) {
            res.status(odataUri.error.status).json({ message: odataUri.error.message });
        }
        // Execute odata get
        if (odataUri.application === '*') {
            // list all application
        } else if (!odataUri.entity) {
            // list entities
        } else {
            
        }
        
        
        odataExecutor(odataUrl, function(err, odataResult) {
            if (err) {
                return res.status(err.status || 500).json({ message: err.message });
            }
            if (odataResult == null)
                odataResult = {};
            res.status(odataResult.status || 200).json(odataResult);
        });


    });

}
