"use strict";

import * as  express  from 'express';

import * as pmongo  from 'phoenix-mongodb';
import * as podata from 'phoenix-odata';
import {ModelManager}  from '../../configuration/index';



export async function get(model: ModelManager, odataUri: podata.OdataParsedUri, res: express.Response): Promise<void> {
    let schema = model.entitySchema(odataUri.entity);

    if (!odataUri.entityId) {
        let docs = await pmongo.odata.execQuery(model.settings.storage.connect, model.connections, schema, odataUri);
        res.status(200).json(docs);

    } else {
        let item = await pmongo.odata.execQueryId(model.settings.storage.connect, model.connections, schema, odataUri);
        res.status(200).json(item);
    }
}

