"use strict";

import * as  express  from 'express';

import * as pmongo  from 'phoenix-mongodb';
import * as podata from 'phoenix-odata';
import {ModelManager}  from '../../configuration/index';



export async function doGet(model: ModelManager, odataUri: podata.OdataParsedUri): Promise<any> {
    let schema = model.entitySchema(odataUri.entity);

    if (!odataUri.entityId) {
        return pmongo.odata.execQuery(model.settings.storage.connect, model.connections, schema, odataUri);

    } else {
        return pmongo.odata.execQueryId(model.settings.storage.connect, model.connections, schema, odataUri);

    }
}

export function doDelete(model: ModelManager, odataUri: podata.OdataParsedUri): Promise<void> {
    let schema = model.entitySchema(odataUri.entity);
    return pmongo.odata.execDelete(model.settings.storage.connect, model.connections, schema, odataUri);

}
