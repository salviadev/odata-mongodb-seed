"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const pmongo = require('phoenix-mongodb');
function doGet(model, odataUri) {
    return __awaiter(this, void 0, Promise, function* () {
        let schema = model.entitySchema(odataUri.entity);
        if (!odataUri.entityId) {
            return pmongo.odata.execQuery(model.settings.storage.connect, model.connections, schema, odataUri);
        }
        else {
            return pmongo.odata.execQueryId(model.settings.storage.connect, model.connections, schema, odataUri);
        }
    });
}
exports.doGet = doGet;
function doDelete(model, odataUri) {
    let schema = model.entitySchema(odataUri.entity);
    return pmongo.odata.execDelete(model.settings.storage.connect, model.connections, schema, odataUri);
}
exports.doDelete = doDelete;
