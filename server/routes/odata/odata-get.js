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
var pmongo = require('phoenix-mongodb');
var podata = require('phoenix-odata');
var pschema = require('phoenix-json-schema-tools');
function throwInvalidEntityId() {
    throw new phoenix_utils_1.http.HttpError("Invalid entityId.", 400);
}
function entityId2MongoFilter(odataUri, schema) {
    let res = {};
    let pkFields = pschema.schema.pkFields(schema);
    if (typeof odataUri.entityId === "string") {
        if (pkFields.length !== 1)
            throwInvalidEntityId();
        res[pkFields[0]] = odataUri.entityId;
    }
    else {
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
function get(model, odataUri, res) {
    return __awaiter(this, void 0, Promise, function* () {
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
            let docs = yield pmongo.odata.execQuery(pmongo.db.connectionString(model.settings.storage.connect), schema.name, schema, mfilter, moptions);
            res.status(200).json(docs);
        }
        else {
            let filterOne = entityId2MongoFilter(odataUri, schema);
            let item = yield pmongo.odata.execQueryId(pmongo.db.connectionString(model.settings.storage.connect), schema.name, schema, filterOne, {});
            res.status(200).json(item);
        }
    });
}
exports.get = get;
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
