"use strict";
const util = require('util');
const phoenix_utils_1 = require('phoenix-utils');
const podata = require('phoenix-odata');
const odataget = require('./odata-get');
const odata_messages_1 = require('./odata-messages');
const index_1 = require('../../configuration/index');
function parseRequestWithId(method, req, res) {
    let odataUri = podata.parseOdataUri(req.url, "DELETE");
    if (odataUri.error) {
        phoenix_utils_1.http.error(res, odataUri.error.message, odataUri.error.status);
        return null;
    }
    let appManager = index_1.applicationManager();
    let model = appManager.application(odataUri.application);
    if (!model) {
        phoenix_utils_1.http.notfound(res, util.format(odata_messages_1.odataRouting.appnotfound, odataUri.application));
        return null;
    }
    let schema = model.entitySchema(odataUri.entity);
    if (!schema) {
        phoenix_utils_1.http.notfound(res, util.format(odata_messages_1.odataRouting.entitynotfound, odataUri.application, odataUri.entity));
        return null;
    }
    if (schema.multiTenant && !odataUri.query.tenantId) {
        phoenix_utils_1.http.error(res, util.format(odata_messages_1.odataRouting.tenantIdmandatory, odataUri.application, odataUri.entity));
        return null;
    }
    return { model: model, odataUri: odataUri };
}
function odataRoutes(app, config, authHandler) {
    app.delete('/upload/:application/entity', function (req, res, next) {
        let opts = parseRequestWithId("DELETE", req, res);
        if (!opts)
            return;
    });
    app.get('/odata/*', function (req, res, next) {
        // Parse url 
        let odataUri = podata.parseOdataUri(req.url, "GET");
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
