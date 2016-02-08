"use strict";
var odata_routes_1 = require("./odata/odata-routes");
function routes(app, config, authHandler) {
    odata_routes_1.odataRoutes(app, config, authHandler);
}
exports.routes = routes;
;
