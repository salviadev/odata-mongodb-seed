"use strict";
exports.model = {
    schema: {
        "name": "SPO_MARCHE",
        "title": "Marché",
        "primaryKey": "idmarche",
        "properties": {
            "idmarche": {
                "title": "Id marché",
                "type": "string"
            },
            "idop": {
                "title": "Id opération",
                "type": "string"
            },
            "acteur": {
                "title": "Acteur",
                "type": "string"
            },
            "tiers": {
                "title": "Tiers",
                "type": "string"
            },
            "lbmarche": {
                "title": "lbmarche",
                "type": "string"
            },
            "representant": {
                "title": "Représentant",
                "type": "string"
            },
            "mntmarche": {
                "title": "Montant marché",
                "type": "money"
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
};
