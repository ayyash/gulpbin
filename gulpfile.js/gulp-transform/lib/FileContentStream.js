"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileContentStream = void 0;
var tslib_1 = require("tslib");
var stream_1 = require("stream");
var common_1 = require("./common");
var PluginError = require("plugin-error");
/**
 * The transformed contents of a File object in streaming mode.
 *
 * @internal
 */
var FileContentStream = /** @class */ (function (_super) {
    tslib_1.__extends(FileContentStream, _super);
    function FileContentStream(transform, file) {
        var _this = _super.call(this) || this;
        _this.transform = transform;
        _this.file = file;
        _this.chunks = [];
        return _this;
    }
    FileContentStream.prototype._transform = function (chunk, _encoding, next) {
        this.chunks.push(chunk);
        next(null);
    };
    FileContentStream.prototype._flush = function (done) {
        var contents = Buffer.concat(this.chunks);
        this.transformContents(contents, done);
    };
    FileContentStream.prototype.transformContents = function (contents, done) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var newContents, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.transform(contents, this.file)];
                    case 1:
                        newContents = _a.sent();
                        this.push(newContents);
                        done(null);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        done(new PluginError(common_1.PLUGIN_NAME, error_1));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return FileContentStream;
}(stream_1.Transform));
exports.FileContentStream = FileContentStream;
//# sourceMappingURL=FileContentStream.js.map