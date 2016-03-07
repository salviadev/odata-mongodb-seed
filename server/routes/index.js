"use strict";
const odata_routes_1 = require("./odata/odata-routes");
const odata_import_routes_1 = require("./odata/odata-import-routes");
function routes(app, config, authHandler) {
    odata_import_routes_1.uploadRoutes(app, config, authHandler);
    odata_routes_1.odataRoutes(app, config, authHandler);
}
exports.routes = routes;
;
