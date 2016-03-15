export var model = {
    schema: {
        "name": "SPO_TYPORESERV",
        "title": "TYPORESERV",
        "primaryKey": "idop",
        "properties": {
            "idop": {
                "title": "Id opération",
                "type": "string"
            },
            "total": {
                "title": "total",
                "type": "number",
                "decimals": 0
            },
            "collecteur": {
                "title": "collecteur",
                "type": "string"
            },
            "commune": {
                "title": "commune",
                "type": "number",
                "decimals": 0
            },
            "departement": {
                "title": "departement",
                "type": "number",
                "decimals": 0
            },
            "epci": {
                "title": "epci",
                "type": "number",
                "decimals": 0
            },
            "prefecture": {
                "title": "prefecture",
                "type": "number",
                "decimals": 0
            },
            "region": {
                "title": "region",
                "type": "number",
                "decimals": 0
            },
            "autre": {
                "title": "autre",
                "type": "number",
                "decimals": 0
            }
        }
    }
}