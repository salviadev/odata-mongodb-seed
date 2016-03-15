export var model = {
    schema: {
        "name": "SPO_BUDFIPOSTE",
        "title": "Budget financement poste",
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
            "dtdecision": {
                "title": "Date décision",
                "type": "date"
            },
            "mntbudget": {
                "title": "Budget",
                "type": "money"
            },
            "demande": {
                "title": "Demande de versement",
                "type": "money"
            },
            "partdemande": {
                "title": "Part demande",
                "type": "number"
            },
            "verse": {
                "title": "Versement",
                "type": "money"
            },
            "partverse": {
                "title": "Part versement",
                "type": "number"
            }
        }
    }
}