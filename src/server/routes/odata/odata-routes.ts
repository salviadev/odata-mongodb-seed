"use strict";

import * as  path  from 'path';
import * as  express  from 'express';
import * as  util  from 'util';
import {http}  from 'phoenix-utils';
import * as podata  from 'phoenix-odata';
import * as odataget from './odata-get';
import {odataRouting} from './odata-messages';

import {applicationManager}  from '../../configuration/index';



export function odataRoutes(app: express.Express, config, authHandler): void {
    app.get('/odata/*', function(req, res, next) {
        // Parse url 
        let odataUri = podata.parseOdataUri(req.url, "GET");
        if (odataUri.error) {
            http.error(res, odataUri.error.message, odataUri.error.status);
            return;
        }
        // Execute odata get
        let appManager = applicationManager();
        if (odataUri.application === '*') {
            res.status(200).json(podata.queryResult(appManager.applications()));
        } else {

            let model = appManager.application(odataUri.application);
            if (!model) {
                http.notfound(res, util.format(odataRouting.appnotfound, odataUri.application));
                return;
            }
            if (odataUri.entity === "$entities") {
                // list entities
                res.status(200).json(podata.queryResult(model.entities()));
            } else {
                let schema = model.entitySchema(odataUri.entity);
                if (!schema) {
                    http.notfound(res, util.format(odataRouting.entitynotfound, odataUri.application, odataUri.entity));
                    return;
                }
                if (schema.multiTenant && !odataUri.query.tenantId) {
                    http.error(res, util.format(odataRouting.tenantIdmandatory, odataUri.application, odataUri.entity));
                    return;
                }

                odataget.get(model, odataUri, res).then(function() {

                }).catch(function(ex) {

                    console.log(ex);
                    http.exception(res, ex);

                });
            }
        }

    });

}
