"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GulpTransformStream = void 0;
var tslib_1 = require("tslib");
var stream_1 = require("stream");
var FileContentStream_1 = require("./FileContentStream");
var common_1 = require("./common");
var PluginError = require("plugin-error");
/**
 * A stream of File objects returned by the plugin.
 *
 * @internal
 */
var GulpTransformStream = /** @class */ (function (_super) {
    tslib_1.__extends(GulpTransformStream, _super);
    function GulpTransformStream(transform) {
        var _this = _super.call(this, { objectMode: true }) || this;
        _this.transform = transform;
        return _this;
    }
    GulpTransformStream.prototype._transform = function (file, _encoding, next) {
        if (file.isBuffer())
            return void this.transformBufferFile(file, next);
        if (file.isStream())
            return void this.transformStreamFile(file, next);
        next(null, file);
    };
    GulpTransformStream.prototype.transformBufferFile = function (file, next) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, error_1;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = file;
                        return [4 /*yield*/, this.transform(file.contents, file)];
                    case 1:
                        _a.contents = _b.sent();
                        next(null, file);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _b.sent();
                        next(new PluginError(common_1.PLUGIN_NAME, error_1));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    GulpTransformStream.prototype.transformStreamFile = function (file, next) {
        var stream = new FileContentStream_1.FileContentStream(this.transform, file);
        stream.on("error", this.emit.bind(this, "error"));
        file.contents = file.contents.pipe(stream);
        next(null, file);
    };
    return GulpTransformStream;
}(stream_1.Transform));
exports.GulpTransformStream = GulpTransformStream;
//# sourceMappingURL=GulpTransformStream.js.map