var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, Promise, generator) {
    return new Promise(function (resolve, reject) {
        generator = generator.call(thisArg, _arguments);
        function cast(value) { return value instanceof Promise && value.constructor === Promise ? value : new Promise(function (resolve) { resolve(value); }); }
        function onfulfill(value) { try { step("next", value); } catch (e) { reject(e); } }
        function onreject(value) { try { step("throw", value); } catch (e) { reject(e); } }
        function step(verb, value) {
            var result = generator[verb](value);
            result.done ? resolve(result.value) : cast(result.value).then(onfulfill, onreject);
        }
        step("next", void 0);
    });
};
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
                "type": "string"
            },
            "commune": {
                "type": "string"
            },
            "object": {
                "type": "string"
            },
            "fpparlogt": {
                "type": "number"
            },
            "maitreoeuvre": {
                "type": "string"
            },
            "monteur": {
                "type": "string"
            },
            "datemaj": {
                "type": "date"
            },
            "meteo": {
                "type": "string"
            },
            "lbphase1": {
                "type": "string"
            },
            "statutphase1": {
                "type": "string"
            },
            "lbstatutphase1": {
                "type": "string"
            },
            "dtdebutphase1": {
                "type": "date"
            },
            "dtfinphase1": {
                "type": "date"
            },
            "lbdebutphase1": {
                "type": "string"
            },
            "lbfinphase1": {
                "type": "string"
            },
            "lbphase2": {
                "type": "string"
            },
            "statutphase2": {
                "type": "string"
            },
            "lbstatutphase2": {
                "type": "string"
            },
            "dtdebutphase2": {
                "type": "date"
            },
            "dtfinphase2": {
                "type": "date"
            },
            "lbdebutphase2": {
                "type": "string"
            },
            "lbfinphase2": {
                "type": "string"
            },
            "lbphase3": {
                "type": "string"
            },
            "statutphase3": {
                "type": "string"
            },
            "lbstatutphase3": {
                "type": "string"
            },
            "dtdebutphase3": {
                "type": "date"
            },
            "dtfinphase3": {
                "type": "date"
            },
            "lbdebutphase3": {
                "type": "string"
            },
            "lbfinphase3": {
                "type": "string"
            },
            "lbphase4": {
                "type": "string"
            },
            "statutphase4": {
                "type": "string"
            },
            "lbstatutphase4": {
                "type": "string"
            },
            "dtdebutphase4": {
                "type": "date"
            },
            "dtfinphase4": {
                "type": "date"
            },
            "lbdebutphase4": {
                "type": "string"
            },
            "lbfinphase4": {
                "type": "string"
            },
            "typeope": {
                "type": "string"
            },
            "anneeprog": {
                "type": "string"
            }
        }
    }
};
