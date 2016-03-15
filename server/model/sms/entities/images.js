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
                "title": "Url",
                "type": "string"
            },
            "idop": {
                "title": "Id opération",
                "type": "string"
            },
            "titre": {
                "title": "Titre",
                "type": "string"
            },
            "photo": {
                "title": "Photo",
                "type": "binary"
            }
        }
    }
};
