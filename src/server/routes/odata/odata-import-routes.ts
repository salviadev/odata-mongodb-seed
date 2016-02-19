"use strict";

import * as  path  from 'path';
import * as  fs from 'fs';
import * as  express  from 'express';
import * as  util  from 'util';
import * as  multer from 'multer';
import {http}  from 'phoenix-utils';
import *  as pmongo  from 'phoenix-mongodb';

import {odataRouting} from './odata-messages';
import {entityId2MongoFilter} from './odata-utils';

import {parseOdataUri, OdataParsedUri}  from './odata-url-parser';
import {applicationManager, ApplicationManager, ModelManager}  from '../../configuration/index';



export function uploadRoutes(app: express.Express, config, authHandler): void {

    let uploadCfg = config.upload || {};
    uploadCfg = Object.assign({ dest: './uploads/', fileField: 'file' }, uploadCfg);
    let upload = multer({ dest: uploadCfg.dest });
    app.post('/odata/:application/:entity/:binaryProperty', upload.single(uploadCfg.fileField), function(req, res, next) {
        let odataUri = parseOdataUri(req.url, "POST");
        if (odataUri.error) {
            http.error(res, odataUri.error.message, odataUri.error.status);
            return;
        }
        if (!odataUri.entityId) return next();
        let appManager = applicationManager();
        let model = appManager.application(odataUri.application);
        if (!model) {
            http.notfound(res, util.format(odataRouting.appnotfound, odataUri.application));
            return;
        }
        let schema = model.entitySchema(odataUri.entity);
        if (!schema) {
            http.notfound(res, util.format(odataRouting.entitynotfound, odataUri.application, odataUri.entity));
            return;
        }
        if (schema.multiTenant && !odataUri.query.tenantId) {
            http.error(res, util.format(odataRouting.tenantIdmandatory, odataUri.application, odataUri.entity));
            return;
        }
        let cs = schema.properties[odataUri.propertyName];
        if (!cs) {
            http.error(res, util.format(odataRouting.propertyNotFound, odataUri.application, odataUri.entity, odataUri.propertyName));
            return;
        }
        if (cs.type === "binary") {
            return _doUploadBinaryProperty(app, odataUri, model, schema, req, res);
        }
        return next();

    });
}

function _doUploadBinaryProperty(app: express.Express, odataUri: OdataParsedUri, model: ModelManager, schema: any, req: express.Request, res: express.Response): void {
    let fileName = path.join(req.file.destination, req.file.filename);
    pmongo.upload.uploadBinaryProperty(pmongo.db.connectionString(model.settings.storage.connect),
        schema, entityId2MongoFilter(odataUri, schema), odataUri.propertyName, req.file.originalname, req.file.mimetype, fs.createReadStream(fileName), function(error) {
            fs.unlink(fileName, function(err) {
                if (error) {
                    http.exception(res, error);
                } else {
                    res.sendStatus(201);
                }
            });
        });
};

