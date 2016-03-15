"use strict";
exports.model = {
    schema: {
        "name": "SPO_OPAVANCEMENT",
        "title": " Avancement d'opération",
        "primaryKey": "idop,evt",
        "properties": {
            "idop": {
                "title": "Id opération",
                "type": "string"
            },
            "evt": {
                "title": "ordre",
                "type": "string"
            },
            "numordre": {
                "title": "Numéro d'ordre",
                "type": "number",
                "decimals": 0
            },
            "lbevt": {
                "title": "Libellé d'évenement",
                "type": "string"
            },
            "statut": {
                "title": "Statut",
                "type": "string"
            },
            "dtevt": {
                "title": "Date d'évenement",
                "type": "date"
            }
        }
    }
};
