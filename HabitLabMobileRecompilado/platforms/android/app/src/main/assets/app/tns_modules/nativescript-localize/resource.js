"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var placeholder_1 = require("./placeholder");
var resource_common_1 = require("./resource.common");
exports.encodeKey = resource_common_1.encodeKey;
function encodeValue(value) {
    return '"' + resource_common_1.replace(["'", '"', "\\", "\n", "\r", "\t", "<", "&"], ["\\'", '\\"', "\\\\", "\\n", "\\r", "\\t", "&lt;", "&amp;"], placeholder_1.convertPlaceholders(value)) + '"';
}
exports.encodeValue = encodeValue;
