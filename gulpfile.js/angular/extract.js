const gulp = require('gulp');
const inject = require('gulp-inject');
const transform = require('gulp-transform');
const rename = require('gulp-rename');
const {  existsSync } = require('fs');

const _translateReg = /\s*["']([\w\d?.,!\s\(\)]+)["']\s*\|\s*translate:['"]([\w]+)['"]\s*/gim;

/*
nice to have
catch count
['"]?([\w\d?.,!\s\(\)]+)['"]?\s*\|\s*translate:['"]([\w]+)['"]:(\d+)


catch select
["']?([\w\d?.,!\s\(\)]+)["']?\s*\|\s*translate:['"]([\w]+)['"]:null:["']([\w\d?.,!\s\(\)]+)["']


catch normal
['"]?([\w\d?.,!\s\(\)]+)['"]?\s*\|\s*translate:['"]([\w]+)['"][^:]
*/
const getSources = function (scan) {
  return gulp.src([scan + '/**/*.ts', scan + '/**/*.html']);
}


const missingFile = function (options, lang) {
  return function () {
    const fileName = `${options.prefix}-${lang.name}.js`;


    if (existsSync(`${options.extract.destination}${fileName}`)) {
      return gulp.src('.');
    }

    const defaultLanguage = options.languages.find(x => x.isDefault);
    const defaultFileName = `${options.extract.destination}/${options.prefix}-${defaultLanguage.name}.js`;

    return gulp.src(defaultFileName)
      .pipe(transform(function (contents, file) {
        // replace 'ar-JO' with 'fr-CA;
        return contents
          .replace(`'${defaultLanguage.localeId}'`, `'${lang.localeId}'`)
          .replace(`'${defaultLanguage.name}'`, `'${lang.name}'`);;
      }, { encoding: 'utf8' }))
      .pipe(rename(fileName))
      .pipe(gulp.dest(options.extract.destination));
  }
}

const extractFunction = function (options, lang) {
  return function () {
    let allKeys = [];
    // read all scripts in locale
    return gulp.src(`${options.extract.destination}${options.prefix}-${lang.name}.js`)
      // inject the terms found in all ts and html files
      .pipe(inject(getSources(options.extract.scan), {
        starttag: '// inject:translations',
        endtag: '// endinject',
        empty: true,
        transform: function (
          filePath,
          file,
          index,
          length,
          targetFile
        ) {
          // for every translate pipe found, insert a new line name: 'value'
          // before you do, check if the match already exists

          const content = file.contents.toString('utf8');
          const destination = targetFile.contents.toString('utf8');

          let _match;
          let keys = [];
          while ((_match = _translateReg.exec(content))) {
            // extract first and second match
            const key = _match[2];
            if (destination.indexOf(key + ':') < 0 && allKeys.indexOf(key) < 0) {
              allKeys.push(key);
              keys.push(`${key}: '${_match[1]}',`);
            }
          }
          return keys.length ? keys.join('\n') : null;
        },
      })
      )
      .pipe(transform(function (contents, file) {
        // move the injection tokens to th end
        return contents
          .replace('// inject:translations', '')
          .replace('// endinject', '// inject:translations \n   // endinject');
      }, { encoding: 'utf8' }))
      .pipe(gulp.dest(options.extract.destination));

  }
}

module.exports = (options) => {

  const allMissingFiles = options.languages.map(language => missingFile(options, language));
  const a = gulp.parallel(...allMissingFiles);


  const _extract = options.languages.map(language => extractFunction(options, language));
  const b = gulp.parallel(..._extract);

  // first create missing files, then append
  return gulp.series(a, b);

}
