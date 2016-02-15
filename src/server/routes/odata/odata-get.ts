"use strict";

import * as  express  from 'express';
import * as  util  from 'util';

import {http}  from 'phoenix-utils';
import *  as pmongo  from 'phoenix-mongodb';
import * as podata from 'phoenix-odata';
import * as pschema from 'phoenix-json-schema-tools';
import {parseOdataUri, OdataParsedUri}  from './odata-url-parser';
import {ApplicationManager, ModelManager}  from '../../configuration/index';


function throwInvalidEntityId(): void {
    throw new http.HttpError("Invalid entityId.", 400);
}

function entityId2MongoFilter(odataUri: OdataParsedUri, schema: any): any {
    let res: any = {};
    let pkFields = pschema.schema.pkFields(schema);
    if (typeof odataUri.entityId === "string") {
        if (pkFields.length !== 1)
            throwInvalidEntityId();
        res[pkFields[0]] = odataUri.entityId;
    } else {
        pkFields.forEach(pn => {
            if (odataUri.entityId[pn] === undefined)
                throwInvalidEntityId();
            res[pn] = odataUri.entityId[pn];
        });

    }
    if (schema.multiTenant) {
        res.tenantId = odataUri.query.tenantId;
    }
    return res;
}

export async function get(model: ModelManager, odataUri: OdataParsedUri, res: express.Response): Promise<void> {
    let schema = model.entitySchema(odataUri.entity);

    if (!odataUri.entityId) {
        let filter = odataUri.query.$filter;
        // addtenant id
        if (schema.multiTenant) {
            let tenantIdFilter = util.format('(tenantId  eq %s)', odataUri.query.tenantId);
            if (filter)
                filter = '(' + filter + ') and ' + tenantIdFilter;
            else
                filter = tenantIdFilter;
        }
        let mfilter = podata.$filter2mongoFilter(filter, schema);
        let moptions = podata.queryOptions(odataUri.query);
        moptions.select = podata.parseSelect(odataUri.query.$select);
        let docs = await pmongo.odata.execQuery(pmongo.db.connectionString(model.settings.storage.connect), schema.name, schema, mfilter, moptions);
        res.status(200).json(docs);

    } else {
        let filterOne = entityId2MongoFilter(odataUri, schema);
        let item = await pmongo.odata.execQueryId(pmongo.db.connectionString(model.settings.storage.connect), schema.name, schema, filterOne, { select: podata.parseSelect(odataUri.query.$select) });
        res.status(200).json(item);
    }
}


/*
unction _execQueryEntity(mongoConfig, odataRequest, schema, after) {
    _connectToMongo(odataRequest, mongoConfig, schema, function(err, db) {
        if (err)
            return after(err, null);
        var callback = function(error, data) {
            after(error, data);
            _close(db);
        };
        var collection, filter, options;
        try {
            collection = db.collection(schema.$name);
            filter = mongoUtils.filter2mongo(odataRequest.query ? odataRequest.query.$filter : null);
            options = mongoUtils.query2options(schema, filter, odataRequest.query, odataRequest.aggregation);

        } catch (ex) {
            ex.status = ex.status || 400;
            return callback(ex, null);

        }
        var execCursor = function(inlinecount, count) {
            collection.find(filter, options).toArray(function(err, docs) {
                if (err)
                    return callback(err, null);
                return callback(null, mongoUtils.docs2odata(options, docs, schema, inlinecount, count, false));
            });

        };
        if (odataRequest.aggregation) {
            return _execAggregation(collection, filter, options, schema, odataRequest, callback);
        }
        if (odataRequest.func) {
            if (odataRequest.func == "$count") {
                return collection.find(filter, {}).count(function(err, count) {
                    if (err)
                        return callback(err, null);
                    callback(null, count);

                });

            } else {
                return callback({
                    status: 400,
                    message: "Unknown Odata function " + odataRequest.func
                }, null);
            }

        } else {
            if (odataRequest.query && odataRequest.query.$inlinecount == "allpages") {
                collection.find(filter, {}).count(function(err, count) {
                    if (err)
                        return callback(err, null);
                    execCursor(true, count);

                });

            } else
                execCursor(false, 0);
        }
    });

}

*/