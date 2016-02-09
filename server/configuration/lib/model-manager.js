"use strict";
var path = require('path');
var disk_storage_1 = require('./disk-storage');
class ModelManager {
    constructor(applicationName, config) {
        this.settings = config;
        this.applicationName = applicationName;
    }
    load(rootPath) {
        let that = this;
        return new Promise((resolve, reject) => {
            disk_storage_1.loadModel(path.join(rootPath, 'entities')).then(function (model) {
                that.model = model;
                resolve();
            }).catch(function (ex) {
                reject(ex);
            });
        });
    }
    destroy() {
        this.model = null;
        this.settings = null;
    }
}
exports.ModelManager = ModelManager;
