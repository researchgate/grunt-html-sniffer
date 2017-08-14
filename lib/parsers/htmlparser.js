'use strict';
var fs = require('fs'),
    path = require('path');

module.exports = function (file) {
    return new Promise(function (resolve, reject) {
        fs.readFile(file, 'utf8', function (err, content) {
            if (err) {
                return reject(err);
            }

            resolve(content);
        });
    }).then(function (content) {
            return {
                file: path.resolve(file),
                content: content
            };
        });
};
