
// after building to host, copy the index.html into host/index folder with all supported languages
// replace text $1 and so on with the right strings (en, ar...)


const gulp = require('gulp');
const rename = require('gulp-rename');
const transform = require('gulp-transform');


const gulpConfig = require('./config.json');

const _config = {
    index: {
        src: gulpConfig.hostUrl + 'client/placeholder.html',
        dest: gulpConfig.hostUrl + 'index' // destination of multiple index files
    },
    locales: {
        Sources: './src/locale/*.js', // locale files to be transfered for ssr purposes
        Destination: gulpConfig.hostUrl + 'server/locale/'
    }

};

const reLTR = /<!-- #LTRCSS -->([\s\S]*)<!-- #ENDLTRCSS -->/gim;
const reRTL = /<!-- #RTLCSS -->([\s\S]*)<!-- #ENDRTLCSS -->/gim;


const _generateIndex = gulpConfig.languages.map(language => {
    return function (cb) {
         gulp.src(_config.index.src)
            .pipe(transform(function(contents, file){
                // change $lang to language
                // change $basehref to either / or /language/ dependong on isUrlBased
                contents = contents.replace(/\$basehref/gim, gulpConfig.isUrlBased ? `/${language.name}/` : '/');

                if (language.isRtl) {
                    // replace $rtl with rtl
                    contents = contents.replace(/\$rtl/gim, 'rtl');
                    // remove reLTR
                    contents = contents.replace(reLTR, '');
                    // strip reRTL
                    contents = contents.replace(reRTL, '$1');
                } else {
                     // replace $rtl with ''
                     contents = contents.replace(/\$rtl/gim, '');
                     // remove reRTL
                     contents = contents.replace(reRTL, '');
                     // strip reLTR
                     contents = contents.replace(reLTR, '$1');
                }

                return contents.replace(/\$lang/gim, language.name);

            }, { encoding: 'utf8' }))
            .pipe(rename({basename: `index.${language.name}`}))
            .pipe(gulp.dest(_config.index.dest));
            cb();
        }
});


exports.generateIndex = gulp.parallel(..._generateIndex);



exports.locales = function () {

    // from src/local/*.js append exports.resources = resources; to end of file then copy to host
     return  gulp.src(_config.locales.Sources)
         .pipe(transform(function (contents, file) {
             return contents +'\n\nexports.resources = resources;';
         }, {encoding: 'utf8'}))
         .pipe(gulp.dest(_config.locales.Destination));
 }


 exports.postbuild = gulp.parallel(exports.generateIndex, exports.locales);
