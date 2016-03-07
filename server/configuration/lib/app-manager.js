"use strict";
const path = require('path');
const phoenix_utils_1 = require('phoenix-utils');
const model_manager_1 = require('./model-manager');
class ApplicationManager {
    constructor(config) {
        this._config = config.odata;
        this._load();
    }
    _load() {
        let that = this;
        that._config.applications = that._config.applications || {};
        if (that._applications) {
            Object.keys(that._applications).forEach(function (appName) {
                that._applications[appName].destroy();
            });
        }
        that._applications = {};
        Object.keys(that._config.applications).forEach(function (appName) {
            that._applications[appName] = new model_manager_1.ModelManager(appName, that._config.applications[appName]);
        });
    }
    application(applicationName) {
        return (this._applications[applicationName]);
    }
    applications() {
        let that = this;
        let res = [];
        if (that._applications) {
            Object.keys(that._applications).forEach(function (appName) {
                let app = phoenix_utils_1.utils.clone(that._applications[appName].settings, true);
                app.applicationName = appName;
                res.push(app);
            });
        }
        return res;
    }
    loadModel(folderName) {
        let that = this;
        let promises = [];
        Object.keys(that._applications).forEach(function (appName) {
            let appRoot = path.join(folderName, appName);
            let model = that._applications[appName];
            promises.push(model.load(appRoot));
        });
        return Promise.all(promises);
    }
}
exports.ApplicationManager = ApplicationManager;
//Singleton 
function _applicationManager() {
    let app;
    return function (config) {
        if (app)
            return app;
        app = new ApplicationManager(config);
        return app;
    };
}
exports.applicationManager = _applicationManager();
