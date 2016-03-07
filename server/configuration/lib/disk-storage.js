"use strict";
const fs = require('fs');
const path = require('path');
function _modelList(folderName) {
    return new Promise((resolve, reject) => {
        fs.readdir(folderName, function (err, items) {
            if (err)
                reject(err);
            else {
                let res = [];
                items.forEach((value) => {
                    if (value.endsWith('.js'))
                        res.push(path.join(folderName, value));
                });
                resolve(res);
            }
        });
    });
}
function loadModel(folderName) {
    return new Promise((resolve, reject) => {
        _modelList(folderName).then(function (files) {
            let res = { entities: {} };
            try {
                files.forEach(function (file) {
                    let model = require(file).model;
                    res.entities[model.schema.name] = model;
                });
                resolve(res);
            }
            catch (ex) {
                reject(ex);
            }
        }).catch(function (ex) {
            reject(ex);
        });
    });
}
exports.loadModel = loadModel;
