"use strict";
const path = require('path');
const disk_storage_1 = require('./disk-storage');
const phoenix_utils_1 = require('phoenix-utils');
class ModelManager {
    constructor(applicationName, config) {
        this.settings = config;
        this.connections = {};
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
        this.connections = null;
    }
    _loaded() {
        let that = this;
        that._schemas = {};
        Object.keys(that._model.entities).forEach(entityName => {
            that._schemas[entityName] = phoenix_utils_1.utils.clone(that._model.entities[entityName].schema, true);
        });
    }
    entitySchema(entityName) {
        return this._schemas[entityName];
    }
    entities() {
        let that = this;
        let res = [];
        Object.keys(that._model.entities).forEach(entityName => {
            let schema = that._schemas[entityName];
            res.push({ entityName: entityName, title: schema.title, multiTenant: schema.multiTenant });
        });
        return res;
    }
    schemas() {
        let that = this;
        return Object.keys(that._schemas).map(entityName => {
            return that._schemas[entityName];
        });
    }
}
exports.ModelManager = ModelManager;
