export var model = {
    schema: {
        "name": "SPO_BUDFI",
        "title": "Budget financement",
        "primaryKey": "idop,ordre",
        "properties": {
            "idop": {
                "title": "Id opération",
                "type": "string"
            },
            "ordre": {
                "title": "ordre",
                "type": "number",
                "decimals": 0
            },
            "rubrique": {
                "title": "Rubrique",
                "type": "string"
            },
            "montant": {
                "title": "Montant",
                "type": "money"
            }
        }
    }
}