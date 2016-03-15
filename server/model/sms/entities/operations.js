"use strict";
exports.model = {
    schema: {
        "name": "SPO_OPERATION",
        "title": "Opérations",
        "primaryKey": "idop",
        "indexes": [{
                "unique": false,
                "fields": "commune"
            }],
        "properties": {
            "idop": {
                "title": "Id Op",
                "type": "string"
            },
            "lbop": {
                "title": "lbop",
                "type": "string"
            },
            "commune": {
                "title": "commune",
                "type": "string"
            },
            "objet": {
                "title": "objet",
                "type": "string"
            },
            "fpparlogt": {
                "title": "fpparlogt",
                "type": "number"
            },
            "maitreoeuvre": {
                "title": "maitreoeuvre",
                "type": "string"
            },
            "monteur": {
                "title": "monteur",
                "type": "string"
            },
            "datemaj": {
                "title": "datemaj",
                "type": "date"
            },
            "meteo": {
                "title": "meteo",
                "type": "string"
            },
            "lbphase1": {
                "title": "lbphase1",
                "type": "string"
            },
            "statutphase1": {
                "title": "statutphase1",
                "type": "string"
            },
            "lbstatutphase1": {
                "title": "lbstatutphase1",
                "type": "string"
            },
            "dtdebutphase1": {
                "title": "dtdebutphase1",
                "type": "date"
            },
            "dtfinphase1": {
                "title": "dtfinphase1",
                "type": "date"
            },
            "lbdebutphase1": {
                "title": "lbdebutphase1",
                "type": "string"
            },
            "lbfinphase1": {
                "title": "lbfinphase1",
                "type": "string"
            },
            "lbphase2": {
                "title": "lbphase2",
                "type": "string"
            },
            "statutphase2": {
                "title": "statutphase2",
                "type": "string"
            },
            "lbstatutphase2": {
                "title": "lbstatutphase2",
                "type": "string"
            },
            "dtdebutphase2": {
                "title": "dtdebutphase2",
                "type": "date"
            },
            "dtfinphase2": {
                "title": "dtfinphase2",
                "type": "date"
            },
            "lbdebutphase2": {
                "title": "lbdebutphase2",
                "type": "string"
            },
            "lbfinphase2": {
                "title": "lbfinphase2",
                "type": "string"
            },
            "lbphase3": {
                "title": "lbphase3",
                "type": "string"
            },
            "statutphase3": {
                "title": "statutphase3",
                "type": "string"
            },
            "lbstatutphase3": {
                "title": "lbstatutphase3",
                "type": "string"
            },
            "dtdebutphase3": {
                "title": "dtdebutphase3",
                "type": "date"
            },
            "dtfinphase3": {
                "title": "dtfinphase3",
                "type": "date"
            },
            "lbdebutphase3": {
                "title": "lbdebutphase3",
                "type": "string"
            },
            "lbfinphase3": {
                "title": "lbfinphase3",
                "type": "string"
            },
            "lbphase4": {
                "title": "lbphase4",
                "type": "string"
            },
            "statutphase4": {
                "title": "statutphase4",
                "type": "string"
            },
            "lbstatutphase4": {
                "title": "lbstatutphase4",
                "type": "string"
            },
            "dtdebutphase4": {
                "title": "dtdebutphase4",
                "type": "date"
            },
            "dtfinphase4": {
                "title": "dtfinphase4",
                "type": "date"
            },
            "lbdebutphase4": {
                "title": "lbdebutphase4",
                "type": "string"
            },
            "lbfinphase4": {
                "title": "lbfinphase4",
                "type": "string"
            },
            "typeope": {
                "title": "typeope",
                "type": "string"
            },
            "anneeprog": {
                "title": "anneeprog",
                "type": "string"
            }
        }
    }
};
