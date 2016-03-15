"use strict";
exports.model = {
    schema: {
        "name": "SPO_VERSION",
        "title": "Versions",
        "primaryKey": "idvers",
        "properties": {
            "idvers": {
                "title": "Id version",
                "type": "number",
                "decimals": 0
            },
            "version": {
                "title": "Version",
                "type": "string"
            }
        }
    }
};
