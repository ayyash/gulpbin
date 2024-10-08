"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentTransformer = void 0;
var tslib_1 = require("tslib");
var PluginError = require("plugin-error");
var common_1 = require("./common");
/**
 * Creates a function for applying a user-defined transformation to
 * file contents.
 *
 * @internal
 */
var ContentTransformer = /** @class */ (function () {
    function ContentTransformer(callback, encoding, thisArg) {
        this.callback = callback;
        this.encoding = encoding;
        this.thisArg = thisArg;
    }
    ContentTransformer.fromConfig = function (config) {
        var callback = config.callback, encoding = config.encoding, thisArg = config.thisArg;
        return new this(callback, encoding, thisArg);
    };
    ContentTransformer.prototype.makeTransformFunction = function () {
        var _this = this;
        return function (contents, file) { return _this.transform(contents, file); };
    };
    ContentTransformer.prototype.transform = function (contents, file) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var decodedContents, callbackResult;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        decodedContents = this.decodeContents(contents);
                        return [4 /*yield*/, this.invokeAndValidate(decodedContents, file)];
                    case 1:
                        callbackResult = _a.sent();
                        return [2 /*return*/, new Buffer(callbackResult, this.encoding)];
                }
            });
        });
    };
    ContentTransformer.prototype.decodeContents = function (contents) {
        if ((0, common_1.isString)(this.encoding))
            return contents.toString(this.encoding);
        return contents;
    };
    ContentTransformer.prototype.invokeAndValidate = function (decodedContents, file) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var callbackResult;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.tryInvokeCallback(decodedContents, file)];
                    case 1:
                        callbackResult = _a.sent();
                        if (this.encoding && !(0, common_1.isString)(callbackResult))
                            throw new TypeError("callback result must be a string when encoding is given");
                        if (!this.encoding && !Buffer.isBuffer(callbackResult))
                            throw new TypeError("callback result must be a Buffer when encoding is not given");
                        return [2 /*return*/, callbackResult];
                }
            });
        });
    };
    ContentTransformer.prototype.tryInvokeCallback = function (decodedContents, file) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.callback.call(this.thisArg, decodedContents, file)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_1 = _a.sent();
                        // Show stack for errors in callback as message alone may not be descriptive enough.
                        throw new PluginError(common_1.PLUGIN_NAME, error_1, { showStack: true });
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ContentTransformer;
}());
exports.ContentTransformer = ContentTransformer;
//# sourceMappingURL=ContentTransformer.js.map