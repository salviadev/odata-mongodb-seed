"use strict";
var phoenix_utils_1 = require('phoenix-utils');
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
exports.entityId2MongoFilter = entityId2MongoFilter;
