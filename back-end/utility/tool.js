var fs = require('fs');

/**
 * @param jsonArray
 * @param conditions
 * @returns {Object}
 */
exports.jsonQuery = function (jsonArray, conditions) {
    var i = 0,
        len = jsonArray.length,
        json,
        condition,
        flag;
    for (; i < len; i++) {
        flag = true;
        json = jsonArray[i];
        for (condition in conditions) {
            if (json[condition] !== conditions[condition]) {
                flag = false;
                break;
            }
        }
        if (flag) {
            return json;
        }
    }
};

/**
 * @param filePath
 * @param [key]
 * @param callback
 */
exports.getConfig = function (filePath, key, callback) {
    if(typeof key === 'function'){
        callback = key;
        key = undefined;
    }
    fs.readFile(filePath, 'utf8', function (err, file) {
        if (err) {
            console.log('read wrongly %s：' + err, filePath);
            return callback(err);
        }
        var data = JSON.parse(file);
        if (typeof key === 'string') {
            data = data[key];
        }
        return callback(null, data);
    });
};

/**
 * @param filePath
 * @param setters
 */
exports.setConfig = function (filePath, setters) {
    fs.readFile(filePath, 'utf8', function (err, file) {
        var data = JSON.parse(file),
            key;
        for (key in setters) {
            data[key] = setters[key];
        }
        var newFile = JSON.stringify(data, null, 2);
        fs.writeFile(filePath, newFile, 'utf8');
    });
};

/**
 * @param [prefix]
 * @param obj
 * @returns {string}
 */
exports.generateKey = function (prefix, obj) {
    if (typeof prefix === 'object') {
        obj = prefix;
        prefix = undefined;
    }
    var attr,
        value,
        key = '';
    for (attr in obj) {
        value = obj[attr];
        key += '_' + attr.toString().toLowerCase() + '_' + value.toString()
    }
    if (prefix) {
        key = prefix + key;
    } else {
        key = key.substr(1);
    }
    return key;
};