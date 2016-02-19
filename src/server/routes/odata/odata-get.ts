"use strict";

import * as  express  from 'express';
import * as  util  from 'util';

import *  as pmongo  from 'phoenix-mongodb';
import * as podata from 'phoenix-odata';
import * as pschema from 'phoenix-json-schema-tools';
import {parseOdataUri, OdataParsedUri}  from './odata-url-parser';
import {ApplicationManager, ModelManager}  from '../../configuration/index';
import {entityId2MongoFilter} from './odata-utils';



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
        let moptions = podata.queryOptions(odataUri.query, schema);
        moptions.application = odataUri.application;
        moptions.entity= odataUri.entity;
        let mfilter = podata.$filter2mongoFilter(filter, schema, moptions);

        moptions.select = podata.parseSelect(odataUri.query.$select);
        let docs = await pmongo.odata.execQuery(pmongo.db.connectionString(model.settings.storage.connect), schema.name, schema, mfilter, moptions);
        res.status(200).json(docs);

    } else {
        let filterOne = entityId2MongoFilter(odataUri, schema);
        let mopts = { select: podata.parseSelect(odataUri.query.$select), application: odataUri.application, entity: odataUri.entity };
        let item = await pmongo.odata.execQueryId(pmongo.db.connectionString(model.settings.storage.connect), schema.name, odataUri.propertyName, schema, filterOne, mopts);
        res.status(200).json(item);
    }
}

