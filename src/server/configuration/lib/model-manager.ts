"use strict";

import * as path  from 'path';
import {loadModel}  from './disk-storage';

export class ModelManager {
    public settings: any;
    public model: any;
    public applicationName: string;
    public load(rootPath: string): Promise<void> {
        let that = this;
        return new Promise<void>((resolve, reject) => {
            loadModel(path.join(rootPath, 'entities')).then(function(model) {
                that.model = model;
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
        this.model = null;
        this.settings = null;
    }

}