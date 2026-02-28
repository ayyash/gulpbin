

const { src, parallel } = require('gulp');
const through = require('through2');
const fs = require('fs');
const path = require('path');



// match all translate("text", "string",);
const _translateReg = /translate\(\s*'([^']*)'\s*,\s*'([^']*)'[\s,]*\)/gim;
// VER_NEXT: do toast meessages and Res.Get
// const _toastReg = /Toast.Show\(Error|Warning|Success)\('([^']*)'/gim;

const getSources = function (scan) {
  return src([scan + '/**/*.ts', scan + '/**/*.svelte']);
}

const extractFunct = function (options, lang) {
  return function () {
    const jsonPath = `${options.extract.destination}keys.${lang.name}.json`;
    const existingKeys = fs.existsSync(jsonPath) 
        ? JSON.parse(fs.readFileSync(jsonPath, 'utf8')) 
        : {};


    return getSources(options.extract.scan) // Adjust path as needed
        .pipe(through.obj(function(file, enc, cb) {
            if (file.isNull()) return cb(null, file);
            
            const content = file.contents.toString('utf8');
            let match;

            // 2. Scan the file for matches
            while ((match = _translateReg.exec(content)) !== null) {
                const key = match[2];
                if (!(key in existingKeys)) {
                    existingKeys[key] = match[1]; 
                }
            }

            cb(null, file);
        }))
        .on('end', () => {
            if (!fs.existsSync(path.dirname(jsonPath))) {
                fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
            }

            fs.writeFileSync(jsonPath, JSON.stringify(existingKeys, null, 4));
            console.log(`✅ Extraction complete. Keys saved to ${jsonPath}`);
        });
  }
}

module.exports = (options) => {
  
    const _extract = options.languages.map(language => extractFunct(options, language));
    return parallel(..._extract);
};