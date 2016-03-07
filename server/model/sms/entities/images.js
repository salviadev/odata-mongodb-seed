"use strict";
exports.model = {
    schema: {
        "name": "SPO_IMAGES",
        "title": "Images",
        "primaryKey": "img",
        "indexes": [{
                "unique": false,
                "fields": "idop"
            }],
        "properties": {
            "img": {
                "type": "string"
            },
            "idop": {
                "type": "string"
            },
            "titre": {
                "type": "string"
            },
            "photo": {
                "title": "Photo",
                "type": "binary"
            }
        }
    }
};
