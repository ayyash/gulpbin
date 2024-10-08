"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
var PluginError = require("plugin-error");
var common_1 = require("./common");
/**
 * A normalized configuration object based on arguments passed to
 * the plugin.
 *
 * @internal
 */
var Config = /** @class */ (function () {
    function Config(callback, encoding, thisArg) {
        this.callback = callback;
        this.encoding = encoding;
        this.thisArg = thisArg;
    }
    Config.fromPluginArguments = function (arg0, arg1) {
        var _a = this.resolveArgs(arg0, arg1), callback = _a[0], optionsOrEncoding = _a[1];
        var options = this.resolveOptions(optionsOrEncoding);
        var encoding = this.getEncoding(options);
        var thisArg = this.getThisArg(options);
        return new this(callback, encoding, thisArg);
    };
    Config.resolveArgs = function (arg0, arg1) {
        if ((0, common_1.isFunction)(arg0))
            return [arg0, arg1];
        if ((0, common_1.isFunction)(arg1))
            return [arg1, arg0];
        throw new PluginError(common_1.PLUGIN_NAME, "callback is required");
    };
    Config.resolveOptions = function (optionsOrEncoding) {
        if ((0, common_1.isObjectLike)(optionsOrEncoding))
            return optionsOrEncoding;
        if ((0, common_1.isString)(optionsOrEncoding))
            return { encoding: optionsOrEncoding };
        if ((0, common_1.isNil)(optionsOrEncoding))
            return { encoding: null };
        throw new PluginError(common_1.PLUGIN_NAME, "options must be an object, a string, null, or undefined");
    };
    Config.getEncoding = function (options) {
        var encoding = options.encoding;
        if ((0, common_1.isNil)(encoding) || encoding === "")
            return null;
        if (!(0, common_1.isString)(encoding))
            throw new PluginError(common_1.PLUGIN_NAME, "encoding must be a string, null, or undefined");
        if (!Buffer.isEncoding(encoding))
            throw new PluginError(common_1.PLUGIN_NAME, "encoding is not supported: ".concat(encoding));
        return encoding;
    };
    Config.getThisArg = function (options) {
        return options.thisArg;
    };
    return Config;
}());
exports.Config = Config;
//# sourceMappingURL=Config.js.map