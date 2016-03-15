export var model = {
    schema: {
        "name": "SPO_BUDPRPOSTE",
        "title": "Budget prix de revient poste",
        "primaryKey": "idop,codeposte",
        "properties": {
            "idop": {
                "title": "Id opération",
                "type": "string"
            },
            "codeposte": {
                "title": "Code poste",
                "type": "string"
            },
            "poste": {
                "title": "Poste",
                "type": "string"
            },
            "niveau": {
                "title": "Niveau",
                "type": "number",
                "decimals": 0
            },
            "position": {
                "title": "Position",
                "type": "string"
            },
            "mntbudget": {
                "title": "Budget",
                "type": "money"
            },
            "engage": {
                "title": "Engagé",
                "type": "money"
            },
            "partengage": {
                "title": "Part engagé",
                "type": "number"
            },
            "facture": {
                "title": "Facturé",
                "type": "money"
            },
            "partfacture": {
                "title": "Part facturée",
                "type": "number"
            }
        }
    }
}