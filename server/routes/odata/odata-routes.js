"use strict";
var phoenix_utils_1 = require('phoenix-utils');
var odata_url_parser_1 = require('./odata-url-parser');
function odataRoutes(app, config, authHandler) {
    app.get('/odata/*', function (req, res, next) {
        // Parse url 
        let odataUri = odata_url_parser_1.parseOdataUri(req.url, "GET");
        if (odataUri.error) {
            phoenix_utils_1.http.error(res, odataUri.error.message, odataUri.error.status);
            return;
        }
        // Execute odata get
        if (odataUri.application === '*') {
            // list all application
            phoenix_utils_1.http.noi(res, 'List of applications: not implemented');
        }
        else if (!odataUri.entity) {
            // list entities
            phoenix_utils_1.http.noi(res, 'List of entities: not implemented');
        }
        else {
        }
        /* odataExecutor(odataUrl, function(err, odataResult) {
             if (err) {
                 return res.status(err.status || 500).json({ message: err.message });
             }
             if (odataResult == null)
                 odataResult = {};
             res.status(odataResult.status || 200).json(odataResult);
         });
         */
    });
}
exports.odataRoutes = odataRoutes;