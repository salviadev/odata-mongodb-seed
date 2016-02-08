"use strict";
class ModelManager {
    //public loadModel(): Promise<ModelManager> {}
    constructor(applicationName, config) {
        this._config = config;
        this.applicationName = applicationName;
    }
    destroy() {
        this._config = null;
    }
}
exports.ModelManager = ModelManager;
