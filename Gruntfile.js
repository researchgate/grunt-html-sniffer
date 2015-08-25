/*
 * grunt-html-sniffer
 * https://github.com/researchgate/grunt-html-sniffer
 *
 * Copyright (c) 2015 ResearchGate GmbH
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    grunt.option('stack', true);

    grunt.initConfig({
        htmlsniffer : {
            dev : {
                options : {
                    checkstyle : 'out/checkstyle.xml'
                },
                src : [
                    'test/**/*.html'
                ],
                checks : {
                    classNameIsNotDynamic: {}
                }
            }
        },
        jshint : {
            all : [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options : {
                jshintrc : '.jshintrc'
            }
        }
    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    //grunt.registerTask('test', ['htmlsniffer', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'htmlsniffer:dev']);
};
