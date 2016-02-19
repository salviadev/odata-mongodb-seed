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
var path = require('path');
var fs = require('fs');
var util = require('util');
var multer = require('multer');
var phoenix_utils_1 = require('phoenix-utils');
var pmongo = require('phoenix-mongodb');
var odata_messages_1 = require('./odata-messages');
var odata_utils_1 = require('./odata-utils');
var odata_url_parser_1 = require('./odata-url-parser');
var index_1 = require('../../configuration/index');
function uploadRoutes(app, config, authHandler) {
    let uploadCfg = config.upload || {};
    uploadCfg = Object.assign({ dest: './uploads/', fileField: 'file' }, uploadCfg);
    let upload = multer({ dest: uploadCfg.dest });
    app.post('/odata/:application/:entity/:binaryProperty', upload.single(uploadCfg.fileField), function (req, res, next) {
        let odataUri = odata_url_parser_1.parseOdataUri(req.url, "POST");
        if (odataUri.error) {
            phoenix_utils_1.http.error(res, odataUri.error.message, odataUri.error.status);
            return;
        }
        if (!odataUri.entityId)
            return next();
        let appManager = index_1.applicationManager();
        let model = appManager.application(odataUri.application);
        if (!model) {
            phoenix_utils_1.http.notfound(res, util.format(odata_messages_1.odataRouting.appnotfound, odataUri.application));
            return;
        }
        let schema = model.entitySchema(odataUri.entity);
        if (!schema) {
            phoenix_utils_1.http.notfound(res, util.format(odata_messages_1.odataRouting.entitynotfound, odataUri.application, odataUri.entity));
            return;
        }
        if (schema.multiTenant && !odataUri.query.tenantId) {
            phoenix_utils_1.http.error(res, util.format(odata_messages_1.odataRouting.tenantIdmandatory, odataUri.application, odataUri.entity));
            return;
        }
        let cs = schema.properties[odataUri.propertyName];
        if (!cs) {
            phoenix_utils_1.http.error(res, util.format(odata_messages_1.odataRouting.propertyNotFound, odataUri.application, odataUri.entity, odataUri.propertyName));
            return;
        }
        if (cs.type === "binary") {
            return _doUploadBinaryProperty(app, odataUri, model, schema, req, res);
        }
        return next();
    });
}
exports.uploadRoutes = uploadRoutes;
function _doUploadBinaryProperty(app, odataUri, model, schema, req, res) {
    let fileName = path.join(req.file.destination, req.file.filename);
    pmongo.upload.uploadBinaryProperty(pmongo.db.connectionString(model.settings.storage.connect), schema, odata_utils_1.entityId2MongoFilter(odataUri, schema), odataUri.propertyName, req.file.originalname, req.file.mimetype, fs.createReadStream(fileName), function (error) {
        fs.unlink(fileName, function (err) {
            if (error) {
                phoenix_utils_1.http.exception(res, error);
            }
            else {
                res.sendStatus(201);
            }
        });
    });
}
;
