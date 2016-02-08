"use strict";
var model_manager_1 = require('./model-manager');
class ApplicationManager {
    constructor(config) {
        this._config = config;
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
