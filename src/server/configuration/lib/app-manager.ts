"use strict";

import {ModelManager} from './model-manager' 

export class ApplicationManager {
    private _config: any;
    private _applications: any;
    private _load() {
        let that = this;
        that._config.applications = that._config.applications || {};
        if (that._applications) {
            Object.keys(that._applications).forEach(function(appName) {
                that._applications[appName].destroy();
            });
        }
        that._applications = {};
        Object.keys(that._config.applications).forEach(function(appName) {
            that._applications[appName] = new ModelManager(appName, that._config.applications[appName]);
        });
    }
    constructor(config: any) {
        this._config = config;
        this._load();
    }

}

//Singleton 
function _applicationManager() {
    let app: ApplicationManager;
    return function(config: any) {
        if(app) return app;
        app = new ApplicationManager(config);
        return app;
    }
   
}

export var applicationManager =  _applicationManager();