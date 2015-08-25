'use strict';
var Promise = require('promise'),
    fs = require('fs');

module.exports = function (file) {
    var readFile = Promise.denodeify(fs.readFile);

    return readFile(file, 'utf8')
        .then(function (content) {
            return {
                file: file,
                content: content
            };
        });
};
