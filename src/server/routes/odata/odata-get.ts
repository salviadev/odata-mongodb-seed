"use strict";

import * as  express  from 'express';
import * as  util  from 'util';

import {http}  from 'phoenix-utils';
import *  as pmongo  from 'phoenix-mongodb';
import * as podata from 'phoenix-odata';
import {parseOdataUri, OdataParsedUri}  from './odata-url-parser';
import {ApplicationManager, ModelManager}  from '../../configuration/index';




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
        let mfilter = podata.$filter2mongoFilter(filter);
        let moptions = podata.queryOptions(odataUri.query);
        let docs = await pmongo.odata.execQuery(pmongo.db.connectionString(model.settings.storage.connect), schema.name, schema, mfilter, moptions);
        if (docs) {
            res.status(200).json(docs);
        } else
            http.noi(res, util.format('Not implemented "%s/%s".', odataUri.application, odataUri.entity));

    } else
        http.error(res, util.format('Not implemented "%s/%s".', odataUri.application, odataUri.entity));
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