"use strict";
var util = require('util');
var phoenix_utils_1 = require('phoenix-utils');
var odata_url_parser_1 = require('./odata-url-parser');
var index_1 = require('../../configuration/index');
function odataRoutes(app, config, authHandler) {
    app.get('/odata/*', function (req, res, next) {
        // Parse url 
        let odataUri = odata_url_parser_1.parseOdataUri(req.url, "GET");
        if (odataUri.error) {
            phoenix_utils_1.http.error(res, odataUri.error.message, odataUri.error.status);
            return;
        }
        // Execute odata get
        let appManager = index_1.applicationManager();
        if (odataUri.application === '*') {
            res.status(200).json(phoenix_utils_1.odata.queryResult(appManager.applications()));
        }
        else {
            let model = appManager.application(odataUri.application);
            if (!model) {
                phoenix_utils_1.http.notfound(res, util.format('Application not found "%s".', odataUri.application));
                return;
            }
            if (odataUri.entity === "$entities") {
                // list entities
                res.status(200).json(phoenix_utils_1.odata.queryResult(model.entities()));
            }
            else {
                let schema = model.entitySchema[odataUri.entity];
                if (!schema) {
                    phoenix_utils_1.http.notfound(res, util.format('Entity not not found "%s/%s".', odataUri.application, odataUri.entity));
                    return;
                }
                if (schema.multiTenant && !odataUri.query.tenantId) {
                    phoenix_utils_1.http.error(res, util.format('The tenantId is required for "%s/%s".', odataUri.application, odataUri.entity));
                    return;
                }
                phoenix_utils_1.http.error(res, util.format('Not implemented "%s/%s".', odataUri.application, odataUri.entity));
            }
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
exports.odataRoutes = odataRoutes;
