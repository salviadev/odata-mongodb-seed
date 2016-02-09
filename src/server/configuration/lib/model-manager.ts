"use strict";

import * as path  from 'path';
import {loadModel}  from './disk-storage';
import {utils}  from 'phoenix-utils';

export class ModelManager {
    public settings: any;
    private _model: any;
    public schemas: any;
    public applicationName: string;
    public load(rootPath: string): Promise<void> {
        let that = this;
        return new Promise<void>((resolve, reject) => {
            loadModel(path.join(rootPath, 'entities')).then(function(model) {
                that._model = model;
                that._loaded();
                resolve();
            }).catch(function(ex) {
                reject(ex);
            });
        });
    }
    constructor(applicationName: string, config: any) {
        this.settings = config;
        this.applicationName = applicationName;
    }
    public destroy() {
        this._model = null;
        this.settings = null;
    }
    private _loaded() {
        let that = this;
        that.schemas = {};
        Object.keys(that._model.entities).forEach(entityName => {
           that.schemas[entityName] = utils.clone(that._model.entities[entityName].schema, true)   
        });
    }
    public entitySchema(entityName: string):any {
        return this.schemas[entityName];
    }
    public entities():any[] {
        let that = this;
        let res = [];
        Object.keys(that._model.entities).forEach(entityName => {
           let schema = that.schemas[entityName];
           res.push({entityName: entityName, title: schema.title, multiTenant: schema.multiTenant === true});   
        });
        return res;
        
    }
    

}