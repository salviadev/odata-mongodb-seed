"use strict";
function _extractEntityIdValue(entityId) {
    if (entityId === '') {
        throw "entityId empty.";
    }
    if (entityId.charAt(0) === '\'') {
        if (entityId[entityId.length - 1] !== '\'')
            throw "EntityId: unterminated string.";
        return { value: entityId.substring(1, entityId.length - 2), isString: true };
    }
    return { value: entityId, isString: false };
}
function _checkEntityId(oUri) {
    try {
        let eid = _extractEntityIdValue(oUri.entityId);
        if (eid.isString) {
            oUri.entityId = eid.value;
            return;
        }
        else {
            let pkItems = oUri.entityId(',');
            let pkMap = {};
            pkItems.forEach(function (segment, index) {
                segment = segment.trim();
                let m = segment.split('=');
                if (m.length !== 2) {
                    if (index || pkItems.length > 1)
                        throw "Invalid entityId.";
                }
                else {
                    let v = _extractEntityIdValue(m[1]);
                    pkMap[m[0].trim()] = v.value;
                }
            });
            oUri.entityId = pkMap;
        }
    }
    catch (ex) {
        oUri.error = { message: ex.message, status: 400 };
    }
}
function _parseEntityId(oUri) {
    let ii = oUri.entity.indexOf('(');
    if (ii > 0) {
        if (oUri.entity[oUri.entity.length - 1] != ')') {
            oUri.error = { message: "Invalid odata entity Id.", status: 400 };
            return;
        }
        oUri.entityId = oUri.entity.substring(ii + 1, oUri.entity.length - 1);
        oUri.entity = oUri.entity.substring(0, ii);
    }
}
function parseOdataUri(url, method) {
    const invalidUrl = 'Invalid odata url, excepted: "/odata/{application}/{entity}"', invalidUrlAppMissing = 'Invalid odata url, application is missing.', invalidUrlAppEntity = 'Invalid odata url, entity is missing.', tenantIdMissing = 'Invalid odata url, the "tenantId" is missing.';
    let root = '/odata/';
    let res = {
        method: method,
        query: {}
    };
    let i = url.indexOf('?');
    if (i < 0) {
        res.error = { message: tenantIdMissing, status: 400 };
        return res;
    }
    let query = url.substring(i + 1);
    url = url.substr(0, i);
    query.split('&').forEach(function (value) {
        var a = value.split('=');
        if (a.length === 2)
            res.query[a[0]] = decodeURIComponent(a[1]);
    });
    i = url.indexOf(root);
    if (i < 0) {
        res.error = { message: invalidUrl, status: 400 };
        return res;
    }
    let s = url.substring(i + root.length) || '';
    let segments = s.split('/');
    res.application = segments.shift() || '';
    if (res.application.indexOf('application') === 0) {
        // list applications
        res.entity = res.application;
        res.application = '*';
    }
    else {
        if (!res.application) {
            res.error = { message: invalidUrlAppMissing, status: 400 };
            return res;
        }
        res.entity = segments.shift() || '';
    }
    if (!res.entity) {
        res.error = { message: invalidUrlAppEntity, status: 400 };
        return res;
    }
    if (!segments.length) {
        _parseEntityId(res);
        return res;
    }
    else {
        if (res.entity.charAt(0) === '$') {
            res.error = { message: "Not implemented yet", status: 400 };
        }
        else {
            // invalid odata url
            res.error = { message: invalidUrl, status: 400 };
        }
    }
    return res;
}
exports.parseOdataUri = parseOdataUri;
/*

  if (!res.entityId && res.query && res.query.$aggregation) {
        var funcs = res.query.$aggregation.split(",");
        funcs.forEach(function(item) {
            var vv = item.trim();
            var cc = vv.split(" ");
            if (cc.length < 3 || (cc[cc.length - 2] != 'as')) {
                res.errorMessage = "Invalid aggregation Id.";
                res.status = 400;
                return res;
            }
            res.aggregation = res.aggregation || {};
            var alias = cc[cc.length - 1];
            cc.pop();
            cc.pop();
            res.aggregation[alias] = cc.join('');
        });
        if (res.query.$groupby) {
            res.groups = res.query.$groupby.split(",");
        }

    }
   */ 
