function isDynamic(classAttribute) {
    var result = classAttribute.search(/\{\{[a-zA-Z]/);
    return result >= 0;
}

module.exports = function (data) {
    return data
        .map(
        function (result) {
            var lines = result.content.split("\n"),
                attribute,
                line,
                classAttributeMatch,
                classAttribute,
                lineNumber,
                re;

            for (lineNumber in lines) {
                if (lines.hasOwnProperty(lineNumber)) {
                    line = lines[lineNumber];
                    re = /[\s}]class=['"]([^'"]*)['"]/g;
                    while ((classAttributeMatch = re.exec(line)) !== null) {
                        classAttribute = classAttributeMatch[1];
                        if (isDynamic(classAttribute)) {
                            result.errors = result.errors || [];
                            result.errors.push(
                                {
                                    line: lineNumber,
                                    column: classAttributeMatch.index,
                                    message: 'Class attribute "' + classAttribute + '" is dynamic which can confuse static analysis',
                                    tag: 'classNameIsNotDynamic'
                                }
                            );
                        }
                    }
                }
            }
            return result;
        }
    ).filter(function (result) {
            return result.errors && result.errors.length > 0;
        });
};
