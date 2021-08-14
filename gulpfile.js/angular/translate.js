const gulp = require('gulp');
const inject = require('gulp-inject');


const gulpConfig = require('./config.json');
const _config = {
    Sources: './src/app/components/**/*.html',
    Destination: './src/locale/'
};

const _translateReg = /{{\s*["']([\w\d?.,!\s\(\)]+)["']\s*\|\s*translate:['"]([\w]+)['"]\s*}}/gim;

// NOTETOSELF: extraction for translation never uses resources.ts, because that is for a single language only

// generate translation json
const _extract = gulpConfig.languages.map(language => {

    return function (cb) {
        // read all what? html files only, find {{ "" | transalate:"something" }} and copy "something" with default text in ar.js...

        let returnStr = '';

        gulp.src(
            _config.Destination + language.name + '.js'
        ).pipe(
            inject(gulp.src(_config.Sources), {
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
                    // for every translate pipe found, insert a new line name: "value"
                    // before you do, check if the match already exists

                    returnStr = '';
                    const content = file.contents.toString('utf8');
                    const destination = targetFile.contents.toString('utf8');
                    let _match;
                    while ((_match = _translateReg.exec(content))) {
                        // extract first and second match
                        if (destination.indexOf(_match[2]) < 0) {
                            returnStr += `"${_match[2]}": "${_match[1]}",`;
                        }
                    }

                    return returnStr === '' ? null : returnStr;
                },
            })
        ).pipe(gulp.dest(_config.Destination));
        cb();
    }
});

exports.extract = gulp.parallel(..._extract);

