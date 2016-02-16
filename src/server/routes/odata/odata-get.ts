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
        let moptions = podata.queryOptions(odataUri.query, schema);
        moptions.select = podata.parseSelect(odataUri.query.$select);
        let docs = await pmongo.odata.execQuery(pmongo.db.connectionString(model.settings.storage.connect), schema.name, schema, mfilter, moptions);
        res.status(200).json(docs);

    } else {
        let filterOne = entityId2MongoFilter(odataUri, schema);
        let item = await pmongo.odata.execQueryId(pmongo.db.connectionString(model.settings.storage.connect), schema.name, schema, filterOne, { select: podata.parseSelect(odataUri.query.$select) });
        res.status(200).json(item);
    }
}

