"use strict";

import * as path  from 'path';
import * as fs from 'fs';
import * as express  from 'express';
import * as util  from 'util';
import * as multer from 'multer';
import * as putils  from 'phoenix-utils';
import * as pmongo  from 'phoenix-mongodb';

import {odataRouting} from './odata-messages';
import {entityId2MongoFilter} from './odata-utils';

import {parseOdataUri, OdataParsedUri}  from './odata-url-parser';
import {applicationManager, ApplicationManager, ModelManager}  from '../../configuration/index';



function checkModel(odataUri: OdataParsedUri, res: express.Response, next: Function): any {
    if (odataUri.error) {
        putils.http.error(res, odataUri.error.message, odataUri.error.status);
        return null;
    }
    if (!odataUri.entityId) {
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

function checkBinaryProp(param: any, odataUri: OdataParsedUri, res: express.Response, next: Function): any {
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

function _doUploadBinaryProperty(app: express.Express, odataUri: OdataParsedUri, model: ModelManager, schema: any, req: express.Request, res: express.Response): void {
    let fileName = path.join(req.file.destination, req.file.filename);
    pmongo.upload.uploadBinaryProperty(pmongo.db.connectionString(model.settings.storage.connect),
        schema, entityId2MongoFilter(odataUri, schema), odataUri.propertyName, req.file.originalname, req.file.mimetype, fs.createReadStream(fileName), function(error) {
            fs.unlink(fileName, function(err) {
                if (error) {
                    putils.http.exception(res, error);
                } else {
                    res.sendStatus(201);
                }
            });
        });
};

function _doImport(app: express.Express, odataUri: OdataParsedUri, model: ModelManager, schema: any, req: express.Request, res: express.Response): void {
    let fileName = path.join(req.file.destination, req.file.filename);
    let afterImport = function(error) {
        fs.unlink(fileName, function(err) {
            if (error) {
                putils.http.exception(res, error);
            } else {
                res.sendStatus(200);
            }
        });
    };
    afterImport(null);
};


export function uploadRoutes(app: express.Express, config, authHandler): void {
    let uploadCfg = config.upload || {};
    uploadCfg = Object.assign({ dest: './uploads/', fileField: 'file' }, uploadCfg);
    let upload = multer({ dest: uploadCfg.dest });
    app.post('/odata/:application/:entity/:binaryProperty', upload.single(uploadCfg.fileField), function(req, res, next) {
        let odataUri = parseOdataUri(req.url, "POST");
        let cb = checkModel(odataUri, res, next);
        if (cb) {
            cb = checkBinaryProp(cb, odataUri, res, next);
            if (cb) _doUploadBinaryProperty(app, odataUri, cb.model, cb.schema, req, res);
        }
    });
    app.post('/upload/:application/:entity', upload.single(uploadCfg.fileField), function(req, res, next) {
        let odataUri = parseOdataUri(req.url, "POST");
        let cb = checkModel(odataUri, res, next);
        if (cb) {
            _doImport(app, odataUri, cb.model, cb.schema, req, res);
        }
    });

    app.get('/odata/:application/:entity/:binaryProperty', function(req, res, next) {
        let odataUri = parseOdataUri(req.url, "GET");
        let cb = checkModel(odataUri, res, next);
        if (cb) {
            cb = checkBinaryProp(cb, odataUri, res, next);
            if (cb) {
                pmongo.upload.downloadBinaryProperty(pmongo.db.connectionString(cb.model.settings.storage.connect),
                    cb.schema, entityId2MongoFilter(odataUri, cb.schema), odataUri.propertyName, res, function(error) {
                        if (error)
                            putils.http.exception(res, error);
                    });

            }
        }
    });
}

