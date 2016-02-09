"use strict";
var path = require('path');
var disk_storage_1 = require('./disk-storage');
var phoenix_utils_1 = require('phoenix-utils');
class ModelManager {
    constructor(applicationName, config) {
        this.settings = config;
        this.applicationName = applicationName;
    }
    load(rootPath) {
        let that = this;
        return new Promise((resolve, reject) => {
            disk_storage_1.loadModel(path.join(rootPath, 'entities')).then(function (model) {
                that._model = model;
                that._loaded();
                resolve();
            }).catch(function (ex) {
                reject(ex);
            });
        });
    }
    destroy() {
        this._model = null;
        this.settings = null;
    }
    _loaded() {
        let that = this;
        that.schemas = {};
        Object.keys(that._model.entities).forEach(entityName => {
            that.schemas[entityName] = phoenix_utils_1.utils.clone(that._model.entities[entityName].schema, true);
        });
    }
    entitySchema(entityName) {
        return this.schemas[entityName];
    }
    entities() {
        let that = this;
        let res = [];
        Object.keys(that._model.entities).forEach(entityName => {
            let schema = that.schemas[entityName];
            res.push({ entityName: entityName, title: schema.title, multiTenant: schema.multiTenant === true });
        });
        return res;
    }
}
exports.ModelManager = ModelManager;
