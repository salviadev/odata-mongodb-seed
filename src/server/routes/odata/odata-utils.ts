"use strict";

import * as  express  from 'express';
import * as  util  from 'util';

import {http}  from 'phoenix-utils';
import * as pschema from 'phoenix-json-schema-tools';
import {parseOdataUri, OdataParsedUri}  from './odata-url-parser';


function throwInvalidEntityId(): void {
    throw new http.HttpError("Invalid entityId.", 400);
}



export function entityId2MongoFilter(odataUri: OdataParsedUri, schema: any): any {
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