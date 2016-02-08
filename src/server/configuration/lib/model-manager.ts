"use strict";
export class ModelManager {
    private _config: any;
    public applicationName: string;
    //public loadModel(): Promise<ModelManager> {}
    constructor(applicationName: string, config: any) {
        this._config = config;
        this.applicationName = applicationName;
    }
    public destroy() {
        this._config = null;
    }
}