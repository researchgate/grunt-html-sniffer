'use strict';

module.exports = function (grunt, results) {

    results.forEach(
        function (result) {
            result.errors.forEach(
                function (error) {
                    grunt.log.error(result.file + ' #(' + error.line + ':' + error.column + '): ' + error.message);
                }
            );
        }
    );

};
