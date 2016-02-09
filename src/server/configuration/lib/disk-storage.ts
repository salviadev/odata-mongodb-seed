"use strict";

import * as fs from 'fs';
import * as path from 'path';

function _modelList(folderName: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
        fs.readdir(folderName, function(err, items: string[]) {
            if (err)
                reject(err);
            else {
                let res = [];
                items.forEach((value: string) => {
                    if (value.endsWith('.js'))
                        res.push(path.join(folderName, value));

                });
                resolve(res);
            }
        })
    });
}

export function loadModel(folderName: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        _modelList(folderName).then(function(files: string[]) {
            let res = {};
            try {
                files.forEach(function(file) {
                    let model = require(file).model;
                    res[model.schema.name] = model;
                });
                resolve(res);
            } catch (ex) {
                reject(ex);
            }

        }).catch(function(ex) {
            reject(ex);
        });
    });
}