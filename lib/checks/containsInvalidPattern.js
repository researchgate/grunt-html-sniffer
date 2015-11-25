module.exports = function (data, config) {
    var patterns = config.patterns || [];
    return data
        .map(
            function (result) {
                var lines = result.content.split("\n"),
                    line,
                    lineNumber,
                    match,
                    i;

                for (lineNumber in lines) {
                    if (lines.hasOwnProperty(lineNumber)) {
                        line = lines[lineNumber];
                        for (i in patterns) {
                            if (patterns.hasOwnProperty(i)) {
                                match = line.match(patterns[i]);
                                if (match) {
                                    result.errors = result.errors || [];
                                    result.errors.push(
                                        {
                                            line: lineNumber,
                                            column: match.index,
                                            message: 'Invalid pattern found: ' + match[0] + '(\\u' + match[0].charCodeAt(0).toString(16) + ')',
                                            tag: 'containsInvalidPattern'
                                        }
                                    );
                                }
                            }
                        }
                    }
                }
                return result;
            }
        ).filter(
            function (result) {
                return result.errors && result.errors.length > 0;
            }
        );
};
