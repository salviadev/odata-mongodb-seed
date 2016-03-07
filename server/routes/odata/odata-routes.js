"use strict";
const util = require('util');
const phoenix_utils_1 = require('phoenix-utils');
const podata = require('phoenix-odata');
const odataget = require('./odata-get');
const odata_messages_1 = require('./odata-messages');
const odata_url_parser_1 = require('./odata-url-parser');
const index_1 = require('../../configuration/index');
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
            res.status(200).json(podata.queryResult(appManager.applications()));
        }
        else {
            let model = appManager.application(odataUri.application);
            if (!model) {
                phoenix_utils_1.http.notfound(res, util.format(odata_messages_1.odataRouting.appnotfound, odataUri.application));
                return;
            }
            if (odataUri.entity === "$entities") {
                // list entities
                res.status(200).json(podata.queryResult(model.entities()));
            }
            else {
                let schema = model.entitySchema(odataUri.entity);
                if (!schema) {
                    phoenix_utils_1.http.notfound(res, util.format(odata_messages_1.odataRouting.entitynotfound, odataUri.application, odataUri.entity));
                    return;
                }
                if (schema.multiTenant && !odataUri.query.tenantId) {
                    phoenix_utils_1.http.error(res, util.format(odata_messages_1.odataRouting.tenantIdmandatory, odataUri.application, odataUri.entity));
                    return;
                }
                odataget.get(model, odataUri, res).then(function () {
                }).catch(function (ex) {
                    console.log(ex);
                    phoenix_utils_1.http.exception(res, ex);
                });
            }
        }
    });
}
exports.odataRoutes = odataRoutes;
