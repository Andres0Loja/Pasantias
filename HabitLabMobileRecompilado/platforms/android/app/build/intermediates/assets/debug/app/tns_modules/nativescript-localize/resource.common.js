"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shorthash = require("shorthash");
function encodeKey(key) {
    return key.match(/^[_a-zA-Z]\w*$/) ? key : "_" + key.replace(/[^\w]/g, "_") + "_" + shorthash.unique(key);
}
exports.encodeKey = encodeKey;
function replace(find, replace, subject) {
    return subject.replace(new RegExp("(" + find.map(function (i) { return i.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&"); }).join("|") + ")", "g"), function (match) { return replace[find.indexOf(match)]; });
}
exports.replace = replace;
