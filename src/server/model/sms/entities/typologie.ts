export var model = {
    schema: {
        "name": "SPO_TYPOLOGIE",
        "title": "Typologie",
        "primaryKey": "idop",
        "properties": {
            "idop": {
                "title": "Id opération",
                "type": "string"
            },
            "nblogt": {
                "title": "Nombre de logements",
                "type": "number",
                "decimals": 0
            },
             "nblogtcoll": {
                "title": "Nombre de logements collectifs",
                "type": "number",
                "decimals": 0
            },
             "nblogtind": {
                "title": "Nombre de logements individuels",
                "type": "number",
                "decimals": 0
            },
            "nbcommerces": {
                "title": "Nbcommerces",
                "type": "number",
                "decimals": 0
            },
            "logtypfin": {
                "title": "Logtypfin",
                "type": "string"
            }
        }
    }
}