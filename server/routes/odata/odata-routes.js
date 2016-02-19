"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, Promise, generator) {
    return new Promise(function (resolve, reject) {
        generator = generator.call(thisArg, _arguments);
        function cast(value) { return value instanceof Promise && value.constructor === Promise ? value : new Promise(function (resolve) { resolve(value); }); }
        function onfulfill(value) { try { step("next", value); } catch (e) { reject(e); } }
        function onreject(value) { try { step("throw", value); } catch (e) { reject(e); } }
        function step(verb, value) {
            var result = generator[verb](value);
            result.done ? resolve(result.value) : cast(result.value).then(onfulfill, onreject);
        }
        step("next", void 0);
    });
};
var util = require('util');
var phoenix_utils_1 = require('phoenix-utils');
var podata = require('phoenix-odata');
var odataget = require('./odata-get');
var odata_messages_1 = require('./odata-messages');
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
