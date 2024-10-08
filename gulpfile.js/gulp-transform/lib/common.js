"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isString = exports.isObjectLike = exports.isNil = exports.isFunction = exports.PLUGIN_NAME = void 0;
/**
 * The name to display when a PluginError is thrown or emitted.
 *
 * @internal
 */
exports.PLUGIN_NAME = "gulp-transform";
/**
 * Tests whether a value is a function.
 *
 * @internal
 */
function isFunction(value) {
    return typeof value === "function";
}
exports.isFunction = isFunction;
/**
 * Tests whether a value is either null or undefined.
 *
 * @internal
 */
function isNil(value) {
    return value == null;
}
exports.isNil = isNil;
/**
 * Tests whether a value is an object that is not a function.
 *
 * @internal
 */
function isObjectLike(value) {
    return typeof value === "object" && !!value;
}
exports.isObjectLike = isObjectLike;
/**
 * Tests whether a value is a string primitive.
 *
 * @internal
 */
function isString(value) {
    return typeof value === "string";
}
exports.isString = isString;
//# sourceMappingURL=common.js.map