"use strict";

import  * as path from 'path';
import {utils} from 'phoenix-utils';
import {ModelManager} from './model-manager';

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
    public applications(): any[] {
        let that = this;
        let res = [];
        if (that._applications) {
            Object.keys(that._applications).forEach(function(appName) {
                let app = utils.clone(that._applications[appName].settings, true);
                app.applicationName = appName;
                res.push(app);
            });
        }
        return res;

    }
    public loadModel(folderName: string): Promise<any> {
        let that = this;
        let promises = [];
        Object.keys(that._applications).forEach(function(appName) {
            let appRoot= path.join(folderName, appName);
            let model = <ModelManager>that._applications[appName];
            promises.push(model.load(appRoot));
        });
        return Promise.all(promises);

    }

    constructor(config: any) {
        this._config = config.odata;
        this._load();
    }

}

//Singleton 
function _applicationManager() {
    let app: ApplicationManager;
    return function(config?: any) {
        if (app) return app;
        app = new ApplicationManager(config);
        return app;
    }

}

export var applicationManager = _applicationManager();