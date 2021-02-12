"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var flagsWidthPrecisionLength = "([-+0#])?(\\d+|\\*)?(\\.(\\d+|\\*))?(hh?|ll?|L|z|j|t|q)?";
var parameterFlagsWidthPrecisionLength = "(\\d+\\$)?" + flagsWidthPrecisionLength;
var types = "[diufFeEgGxXoscpaA]";
function replacePlaceholder(find, replace, subject) {
    var match = null;
    while (null !== (match = find.exec(subject))) {
        var previousString = subject.substring(0, match.index);
        if (isEndingWithPercentSign(previousString)) {
            continue;
        }
        var replacedString = replace.apply(void 0, match);
        find.lastIndex += replacedString.length - match[0].length;
        subject = previousString + replacedString + subject.substring(match.index + match[0].length);
    }
    return subject;
}
function isEndingWithPercentSign(subject) {
    return /(?:^|[^%])(?:%%)*%$/.test(subject);
}
function convertPlaceholders(subject) {
    return numberPlaceholders(escapeSinglePercentSign(subject));
}
exports.convertPlaceholders = convertPlaceholders;
function convertAtSignToStringSign(subject) {
    return replacePlaceholder(new RegExp("(%" + parameterFlagsWidthPrecisionLength + ")@", "g"), function (_, $1) { return $1 + "s"; }, subject);
}
exports.convertAtSignToStringSign = convertAtSignToStringSign;
function convertStringSignToAtSign(subject) {
    return replacePlaceholder(new RegExp("(%" + parameterFlagsWidthPrecisionLength + ")s", "g"), function (_, $1) { return $1 + "@"; }, subject);
}
exports.convertStringSignToAtSign = convertStringSignToAtSign;
function escapeSinglePercentSign(subject) {
    return subject.replace(new RegExp("(^|[^%])(%)(?!(%|" + parameterFlagsWidthPrecisionLength + types + "))", "g"), "$1%%");
}
exports.escapeSinglePercentSign = escapeSinglePercentSign;
function numberPlaceholders(subject) {
    var index = 0;
    return replacePlaceholder(new RegExp("%(" + flagsWidthPrecisionLength + types + ")", "g"), function (_, $1) { return "%" + ++index + "$" + $1; }, subject);
}
exports.numberPlaceholders = numberPlaceholders;
