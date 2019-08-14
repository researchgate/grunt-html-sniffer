/*
 * grunt-html-sniffer
 * https://github.com/researchgate/grunt-html-sniffer
 *
 * Copyright (c) 2015 ResearchGate GmbH
 * Licensed under the MIT license.
 */

'use strict';
const htmlparser = require('../lib/parsers/htmlparser');
const Queue = require('promise-queue');
const glob = require('fast-glob');
const flatten = require('flatten');
const checks = require('../lib/checks');
const reporters = require('../lib/reporters');

Queue.configure(Promise);

function getFilesFromPath(patterns) {
    if (!patterns) {
        return Promise.reject(new Error('No source file paths found.'));
    }

    return Promise.all(patterns.map(pattern => glob(pattern)));
}

function mapQueued(numConcurrent, keys, fn) {
    const queue = new Queue(numConcurrent, Infinity);

    return keys.map(key => queue.add(() => fn(key)));
}

module.exports = function (grunt) {
    grunt.registerMultiTask('htmlsniffer', 'Sniffer for your HTML sources', function () {
        var done = this.async(),
            checksConfig = this.data.checks,
            self = this;

        getFilesFromPath(this.data.src)
            .then(flatten)
            .then(function (files) {
                return Promise.all(mapQueued(50, files, htmlparser));
            })
            .then(flatten)
            .then(
                function (data) {
                    return Object.keys(checksConfig).map(
                        function (checkName) {
                            var check = checks[checkName],
                                config = checksConfig[checkName];

                            if (!check) {
                                grunt.fail.warn('Check ' + checkName + ' not found.');
                                return;
                            }

                            return check(data, config);
                        }
                    );
                }
            )
            .then(flatten)
            .then(function (results) {
                results.forEach(function (result) {
                    // correct line-number to be not zero based
                    result.errors.forEach(function (error) { error.line++; });
                });

                return results;
            })
            .then(function (results) {
                if (self.data.options.checkstyle) {
                    grunt.file.write(self.data.options.checkstyle, reporters.checkstyle(results));
                } else {
                    reporters.console(grunt, results);
                }

                done();
            }).catch(function (err) { throw err; });
    });
};
