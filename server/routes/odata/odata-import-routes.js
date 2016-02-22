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
var putils = require('phoenix-utils');
var pmongo = require('phoenix-mongodb');
var odata_messages_1 = require('./odata-messages');
var odata_utils_1 = require('./odata-utils');
var odata_url_parser_1 = require('./odata-url-parser');
var index_1 = require('../../configuration/index');
function checkModel(odataUri, entityIdMandatory, res, next) {
    if (odataUri.error) {
        putils.http.error(res, odataUri.error.message, odataUri.error.status);
        return null;
    }
    if (entityIdMandatory && !odataUri.entityId) {
        next();
        return null;
    }
    else if (!entityIdMandatory && odataUri.entityId) {
        next();
        return null;
    }
    let appManager = index_1.applicationManager();
    let model = appManager.application(odataUri.application);
    if (!model) {
        putils.http.notfound(res, util.format(odata_messages_1.odataRouting.appnotfound, odataUri.application));
        return null;
    }
    let schema = model.entitySchema(odataUri.entity);
    if (!schema) {
        putils.http.notfound(res, util.format(odata_messages_1.odataRouting.entitynotfound, odataUri.application, odataUri.entity));
        return null;
    }
    if (schema.multiTenant && !odataUri.query.tenantId) {
        putils.http.error(res, util.format(odata_messages_1.odataRouting.tenantIdmandatory, odataUri.application, odataUri.entity));
        return null;
    }
    return { schema: schema, model: model };
}
function checkBinaryProp(param, odataUri, res, next) {
    let cs = param.schema.properties[odataUri.propertyName];
    if (!cs) {
        putils.http.error(res, util.format(odata_messages_1.odataRouting.propertyNotFound, odataUri.application, odataUri.entity, odataUri.propertyName));
        return null;
    }
    if (cs.type === "binary") {
        return param;
    }
    next();
    return null;
}
function _doUploadBinaryProperty(app, odataUri, model, schema, req, res) {
    let fileName = path.join(req.file.destination, req.file.filename);
    pmongo.upload.uploadBinaryProperty(pmongo.db.connectionString(model.settings.storage.connect), schema, odata_utils_1.entityId2MongoFilter(odataUri, schema), odataUri.propertyName, req.file.originalname, req.file.mimetype, fs.createReadStream(fileName), function (error) {
        fs.unlink(fileName, function (err) {
            if (error) {
                putils.http.exception(res, error);
            }
            else {
                res.sendStatus(201);
            }
        });
    });
}
;
function _doImport(app, odataUri, model, schema, req, res) {
    let fileName = path.join(req.file.destination, req.file.filename);
    let success = '';
    let dbUri = pmongo.db.connectionString(model.settings.storage.connect);
    let opts = {
        truncate: odataUri.query.truncate && odataUri.query.truncate !== 'false',
        onImported: function (cs, count) {
            success = util.format("%s: %d lines impotred", cs.name, count);
        },
        format: odataUri.query.format || 'json'
    };
    let afterImport = function (error) {
        fs.unlink(fileName, function (err) {
            if (error) {
                putils.http.exception(res, error);
            }
            else {
                res.status(200).send(success);
            }
        });
    };
    let tenantId = parseInt(odataUri.query.tenantId || '0', 10);
    let readStream = fs.createReadStream(fileName);
    pmongo.schema.importCollectionFromStream(dbUri, schema, readStream, opts, tenantId).then(function () {
        afterImport(null);
    }).catch(function (error) {
        afterImport(error);
    });
}
;
function uploadRoutes(app, config, authHandler) {
    let uploadCfg = config.upload || {};
    uploadCfg = Object.assign({ dest: './uploads/', fileField: 'file' }, uploadCfg);
    let upload = multer({ dest: uploadCfg.dest });
    app.post('/odata/:application/:entity/:binaryProperty', upload.single(uploadCfg.fileField), function (req, res, next) {
        let odataUri = odata_url_parser_1.parseOdataUri(req.url, "POST");
        let cb = checkModel(odataUri, true, res, next);
        if (cb) {
            cb = checkBinaryProp(cb, odataUri, res, next);
            if (cb)
                _doUploadBinaryProperty(app, odataUri, cb.model, cb.schema, req, res);
        }
    });
    app.post('/upload/:application/:entity', upload.single(uploadCfg.fileField), function (req, res, next) {
        let odataUri = odata_url_parser_1.parseOdataUri(req.url, "POST");
        let cb = checkModel(odataUri, false, res, next);
        if (cb) {
            _doImport(app, odataUri, cb.model, cb.schema, req, res);
        }
    });
    app.get('/odata/:application/:entity/:binaryProperty', function (req, res, next) {
        let odataUri = odata_url_parser_1.parseOdataUri(req.url, "GET");
        let cb = checkModel(odataUri, true, res, next);
        if (cb) {
            cb = checkBinaryProp(cb, odataUri, res, next);
            if (cb) {
                pmongo.upload.downloadBinaryProperty(pmongo.db.connectionString(cb.model.settings.storage.connect), cb.schema, odata_utils_1.entityId2MongoFilter(odataUri, cb.schema), odataUri.propertyName, res, function (error) {
                    if (error)
                        putils.http.exception(res, error);
                });
            }
        }
    });
}
exports.uploadRoutes = uploadRoutes;
