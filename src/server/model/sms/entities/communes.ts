export var model = {
    schema: {
        "name": "SPO_COMMUNE",
        "title": "Communes",
        "primaryKey": "idcommune",
        "indexes": [{
            "unique": true,
            "fields": "commune"
        }],
        "properties": {
            "idcommune": {
                "title": "Id commune",
                "type": "string"
            },
            "commune": {
                "title": "Commune",
                "type": "string"
            }
        }
    }
}