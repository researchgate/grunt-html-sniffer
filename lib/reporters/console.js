'use strict';

module.exports = function (grunt, results) {

    results.forEach(
        function (result) {
            result.errors.forEach(
                function (error) {
                    grunt.log.errorlns(result.file + ' #(' + error.line + ':' + error.column + '): ' + error.message);
                }
            );
        }
    );

};
