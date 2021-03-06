var gulp = require('gulp');
var shutConfig = require('../config.json');
// var transform = require('gulp-transform');
var inject = require('gulp-inject');
var path = require('path');


// generate icons from styles generated by icomoons
// prepare icons from remote folder that has the extracted files from icomoon tool if that is the case

// source: C:\D\zjunk\aumet\fontsproject
// destination mockups/dummy and assets/fonts

const fontspath = shutConfig.iconfontspath;
const _prepvars = function(){
    return gulp.src([fontspath + 'variables.less', fontspath + 'selection.json'])
        .pipe(gulp.dest(shutConfig.srcUrl + 'dummy'));
};
const _prepfonts = function(){

    return gulp.src([fontspath + 'fonts/*'])
        .pipe(gulp.dest(shutConfig.distUrl + 'fonts'));
}

const prepicons = gulp.parallel(_prepfonts, _prepvars);

let liIconStr = "";
const _getLigas = function(){
	// require selection.json here, find ligature by icon var
	// needs fixing, create a new config 
	// this is a problem, i need to get the file in output project, not here
	// testing with process.cwd hoping that the task will be run from root of client
	// TODO: test when task is not running from root (gulp by default runs from root unless --gulpfile is specified)
	// console.log('relative', path.relative( process.cwd(), `${shutConfig.srcUrl}dummy/`));
	
	var icons = require(`${process.cwd()}/${shutConfig.srcUrl}dummy/selection.json`).icons;

	
    let array = {};
    for (a of icons) {
		array[a.properties.name] = a.properties.ligatures;

	}
	return array;

};


const _cssicons = function () {

    let returnStr = "";
	const ligas = _getLigas();

    return gulp.src(shutConfig.srcUrl + 'less/ui.icons.less')
        .pipe(inject(
            gulp.src(shutConfig.srcUrl + 'dummy/variables.less'),
            {
                starttag: '// inject:icons', endtag: '// endinject',
                transform: function (filePath, file) {
                    // for ever @icon-arrow-all: "\e900"; generate @icon-arrow-all: "\e900";    .icon(icon-arrow-all, @icon-arrow-all);
                    var lines = file.contents.toString('utf8').split('\n');
                    lines.forEach(function (value) {
                        if (value.indexOf('@icon-') > -1) {
                            // add to the line icon(something, icon);
                            const name = value.split(":")[0];
                            value += "	.icon({0},{1});\r\n"
                                .replace("{0}", name.substring(1))
                                .replace("{1}", name);

                            returnStr += value;

                            liIconStr += '<li><span class="symbol {0}">{1}</span> <i>{2}</i></li>'
                                .replace("{0}", name.substring(1))
								.replace("{1}", name)
								.replace("{2}", ligas[name.substring(6)]);
                        }
                    })
                    return returnStr;
                }
            }
        ))
        .pipe(gulp.dest(shutConfig.srcUrl + 'less/'));



};

const iconset = gulp.series(_cssicons, function(){


    return gulp.src(shutConfig.srcUrl + 'dummy/iconset.html')
        .pipe(inject(
            gulp.src(shutConfig.srcUrl + 'dummy/variables.less', { read: false }),
            {
                starttag: '<!-- inject:icons -->', endtag: '<!-- endinject -->',
                transform: function (filePath, file) {
                    //just inject text as is
                    return liIconStr;
                }
            }
        ))
        .pipe(gulp.dest(shutConfig.srcUrl + 'dummy/'));
});

const createicons = gulp.series(prepicons, iconset);


module.exports = function(config) {
	shutConfig = config;


	return {
		iconset,
		createicons,
		prepicons
	};
}