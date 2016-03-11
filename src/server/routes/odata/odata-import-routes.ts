"use strict";

import * as path  from 'path';
import * as fs from 'fs';
import * as express  from 'express';
import * as util  from 'util';
import * as multer from 'multer';
import * as putils  from 'phoenix-utils';
import * as pmongo  from 'phoenix-mongodb';
import * as podata  from 'phoenix-odata';

import {odataRouting} from './odata-messages';
import {applicationManager, ApplicationManager, ModelManager}  from '../../configuration/index';



function checkModel(odataUri: podata.OdataParsedUri, entityIdMandatory: boolean, res: express.Response, next: Function): any {
    if (odataUri.error) {
        putils.http.error(res, odataUri.error.message, odataUri.error.status);
        return null;
    }
    if (entityIdMandatory && !odataUri.entityId) {
        next();
        return null;
    } else if (!entityIdMandatory && odataUri.entityId) {
        next();
        return null;
    }

    let appManager = applicationManager();
    let model = appManager.application(odataUri.application);
    if (!model) {
        putils.http.notfound(res, util.format(odataRouting.appnotfound, odataUri.application));
        return null;
    }
    let schema = model.entitySchema(odataUri.entity);
    if (!schema) {
        putils.http.notfound(res, util.format(odataRouting.entitynotfound, odataUri.application, odataUri.entity));
        return null;
    }
    if (schema.multiTenant && !odataUri.query.tenantId) {
        putils.http.error(res, util.format(odataRouting.tenantIdmandatory, odataUri.application, odataUri.entity));
        return null;
    }
    return { schema: schema, model: model };
}

function _checkBinaryProp(param: any, odataUri: podata.OdataParsedUri, res: express.Response, next: Function): any {
    let cs = param.schema.properties[odataUri.propertyName];
    if (!cs) {
        putils.http.error(res, util.format(odataRouting.propertyNotFound, odataUri.application, odataUri.entity, odataUri.propertyName));
        return null;
    }
    if (cs.type === "binary") {
        return param;
    }
    next();
    return null;

}

function _doUploadBinaryProperty(app: express.Express, odataUri: podata.OdataParsedUri, model: ModelManager, schema: any, req: express.Request, res: express.Response): void {
    let fileName = path.join(req.file.destination, req.file.filename);
    pmongo.upload.uploadBinaryProperty(model.settings.storage.connect, model.connections,
        schema, odataUri, req.file.originalname, req.file.mimetype, fs.createReadStream(fileName))
        .then(function() {
            fs.unlink(fileName, function(err) {
                res.sendStatus(201);
            });
        }).catch(function(error) {
            fs.unlink(fileName, function(err) {
                putils.http.exception(res, error);
            });
        });

};

function _doImport(app: express.Express, odataUri: podata.OdataParsedUri, model: ModelManager, schema: any, req: express.Request, res: express.Response): void {
    let fileName = path.join(req.file.destination, req.file.filename);
    let success = '';
    let opts = {
        truncate: odataUri.query.truncate && odataUri.query.truncate !== 'false',
        onImported: function(cs, count) {
            success = util.format("%s: %d lines impotred", cs.name, count);

        },
        format: odataUri.query.format || 'json'
    };
    let afterImport = function(error) {
        fs.unlink(fileName, function(err) {
            if (error) {
                putils.http.exception(res, error);
            } else {
                res.status(200).send(success);
            }
        });
    };
    let tenantId = parseInt(odataUri.query.tenantId || '0', 10);

    let readStream = fs.createReadStream(fileName);

    pmongo.schema.importCollectionFromStream(model.settings.storage.connect, model.connections, schema, readStream, opts, tenantId).then(function() {
        afterImport(null);
    }).catch(function(error) {
        afterImport(error);
    })
};


export function uploadRoutes(app: express.Express, config, authHandler): void {

    let uploadCfg = config.upload || {};
    uploadCfg = Object.assign({ dest: './uploads/', fileField: 'file' }, uploadCfg);
    let upload = multer({ dest: uploadCfg.dest });
    app.post('/odata/:application/:entity/:binaryProperty', upload.single(uploadCfg.fileField), function(req, res, next) {
        let odataUri = podata.parseOdataUri(req.url, "POST");
        let cb = checkModel(odataUri, true, res, next);
        if (cb) {
            cb = _checkBinaryProp(cb, odataUri, res, next);
            if (cb) _doUploadBinaryProperty(app, odataUri, cb.model, cb.schema, req, res);
        }
    });
    app.post('/upload/:application/:entity', upload.single(uploadCfg.fileField), function(req, res, next) {
        let odataUri = podata.parseOdataUri(req.url, "POST");
        let cb = checkModel(odataUri, false, res, next);
        if (cb) {
            _doImport(app, odataUri, cb.model, cb.schema, req, res);
        }
    });
    app.get('/odata/:application/:entity/:binaryProperty', function(req, res, next) {
        let odataUri = podata.parseOdataUri(req.url, "GET");
        let cb = checkModel(odataUri, true, res, next);
        if (cb) {
            cb = _checkBinaryProp(cb, odataUri, res, next);
            if (cb) {
                pmongo.upload.downloadBinaryProperty(cb.model.settings.storage.connect, cb.model.connections, cb.schema, odataUri, res)
                    .then(function() { })
                    .catch(function(error) {
                        putils.http.exception(res, error);
                    });

            }
        }
    });

}

