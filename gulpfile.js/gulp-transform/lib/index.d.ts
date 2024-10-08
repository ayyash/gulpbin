/// <reference types="node" />
import Vinyl = require("vinyl");
/**
 * Creates a Gulp plugin stream that performs a user-defined transformation
 * on file contents.
 *
 * @param  encoding  A character encoding used to convert the file contents to a string, or
 *                   null to invoke the callback with a Buffer. Defaults to null.
 * @param  callback  A callback describing the transformation. Invoked with (0) the file
 *                   contents and (1) the File object. Returns either the new contents or a
 *                   Promise for the new contents.
 * @return           Returns a Gulp plugin stream.
 */
declare function gulpTransform(encoding: gulpTransform.Encoding, callback: (contents: string, file: Vinyl) => string | PromiseLike<string>): NodeJS.ReadWriteStream;
/**
 * Creates a Gulp plugin stream that performs a user-defined transformation
 * on file contents.
 *
 * @param  encoding  A character encoding used to convert the file contents to a string, or
 *                   null to invoke the callback with a Buffer. Defaults to null.
 * @param  callback  A callback describing the transformation. Invoked with (0) the file
 *                   contents and (1) the File object. Returns either the new contents or a
 *                   Promise for the new contents.
 * @return           Returns a Gulp plugin stream.
 */
declare function gulpTransform(encoding: null, callback: (contents: Buffer, file: Vinyl) => Buffer | PromiseLike<Buffer>): NodeJS.ReadWriteStream;
/**
 * Creates a Gulp plugin stream that performs a user-defined transformation
 * on file contents.
 *
 * @param  options   An object that accepts the following options:
 *                     - encoding: A character encoding used to convert the file contents to
 *                       a string, or null to invoke the callback with a Buffer. Defaults to
 *                       null.
 *                     - thisArg: The value of this within the callback. Defaults to
 *                       undefined.
 * @param  callback  A callback describing the transformation. Invoked with (0) the file
 *                   contents and (1) the File object. Returns either the new contents or a
 *                   Promise for the new contents.
 * @return           Returns a Gulp plugin stream.
 */
declare function gulpTransform(options: {
    encoding: gulpTransform.Encoding;
    thisArg?: any;
}, callback: (contents: string, file: Vinyl) => string | PromiseLike<string>): NodeJS.ReadWriteStream;
/**
 * Creates a Gulp plugin stream that performs a user-defined transformation
 * on file contents.
 *
 * @param  options   An object that accepts the following options:
 *                     - encoding: A character encoding used to convert the file contents to
 *                       a string, or null to invoke the callback with a Buffer. Defaults to
 *                       null.
 *                     - thisArg: The value of this within the callback. Defaults to
 *                       undefined.
 * @param  callback  A callback describing the transformation. Invoked with (0) the file
 *                   contents and (1) the File object. Returns either the new contents or a
 *                   Promise for the new contents.
 * @return           Returns a Gulp plugin stream.
 */
declare function gulpTransform(options: {
    encoding?: null;
    thisArg?: any;
}, callback: (contents: Buffer, file: Vinyl) => Buffer | PromiseLike<Buffer>): NodeJS.ReadWriteStream;
/**
 * Creates a Gulp plugin stream that performs a user-defined transformation
 * on file contents.
 *
 * @param  callback  A callback describing the transformation. Invoked with (0) the file
 *                   contents and (1) the File object. Returns either the new contents or a
 *                   Promise for the new contents.
 * @return           Returns a Gulp plugin stream.
 */
declare function gulpTransform(callback: (contents: Buffer, file: Vinyl) => Buffer | PromiseLike<Buffer>): NodeJS.ReadWriteStream;
declare namespace gulpTransform {
    /**
     * A character encoding supported by Node.js.
     */
    type Encoding = "ascii" | "utf8" | "utf16le" | "ucs2" | "base64" | "latin1" | "binary" | "hex";
}
export = gulpTransform;
