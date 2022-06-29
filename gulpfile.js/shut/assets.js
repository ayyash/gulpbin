const gulp = require('gulp');
// WATCH: NOTE: replacing gulp-cssmin with gulp-clean-css even though the output is a bit larger
// because of a vunrability in gulp-cssmin

var less = require('gulp-less');
var cleancss = require('gulp-clean-css');
var rename = require('gulp-rename');
var inject = require('gulp-inject');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var transform = require('gulp-transform');

var shutConfig = require('../config.json');


var rtl = require('./rtl.js');
var critical = require('./critical.js');

// use less/sh.imports.less to create a less file of all ui* and media*, then generate src/css/sh.css
const rawless = function () {
	return gulp
		.src(shutConfig.srcUrl + 'less/sh.imports.less')
		.pipe(
			inject(gulp.src(shutConfig.srcUrl + 'less/ui.*.less', { read: false }), {
				starttag: '// inject:uiless',
				endtag: '// endinject',
				relative: true
			})
		)
		.pipe(
			inject(gulp.src(shutConfig.srcUrl + 'less/media.*.less', { read: false }), {
				starttag: '// inject:medialess',
				endtag: '// endinject'
			})
		)
		.pipe(rename({ basename: 'all' }))
		.pipe(gulp.dest(shutConfig.srcUrl + 'less/'))
		.pipe(
			less({
				paths: [shutConfig.shutUrl + 'less/']
			})
		)
		.on('error', function (err) {
			console.log(err);
			this.emit('end');
		})
		.pipe(
			autoprefixer({
				overrideBrowserslist: shutConfig.browserslist
			})
		)
		.pipe(rename({ basename: shutConfig.projectName }))
		.pipe(gulp.dest(shutConfig.distUrl + 'css'))
		.on('error', console.error.bind(console));
};

// use all.less, concat to sh.rtl.imports.less, the inject rtl.*.less to generate src/css/sh.rtl.css
const rawlessRtl = function () {
	return gulp.src([shutConfig.srcUrl + 'less/all.less', shutConfig.srcUrl + 'less/sh.rtl.imports.less'])
		.pipe(concat('all.rtl.less', { newLine: '' }))
		.pipe(
			inject(gulp.src(shutConfig.srcUrl + 'less/rtl.*.less', { read: false }), {
				starttag: '// inject:rtlless',
				endtag: '// endinject',
				relative: true
			})
		)
		.pipe(
			gulp.dest(shutConfig.srcUrl + 'less/')
		)
		.pipe(
			less({
				paths: [shutConfig.shutUrl + 'less/']
			})
		)
		.on('error', function (err) {
			console.log(err);
			this.emit('end');
		})
		.pipe(
			autoprefixer({
				overrideBrowserslist: shutConfig.browserslist
			})
		)
		.pipe(rename({ basename: shutConfig.projectName, suffix: '.rtl' }))
		.pipe(gulp.dest(shutConfig.distUrl + 'css'))
		.on('error', console.error.bind(console));
};

// mirror /src/css/sh.rtl.css
const rawMirror = gulp.series(rawlessRtl, function () {

	return gulp.src(`${shutConfig.distUrl}css/${shutConfig.projectName}.rtl.css`)
		.pipe(transform(function (contents, file) {
			return rtl.MirrorText(contents);
		}, { encoding: 'utf8' }))
		.pipe(gulp.dest(shutConfig.distUrl + 'css/'));
});

// remove non critical from sh.css and in sh.general.css
// may be i should make the critical less an isolated function from output css to reduce overhead on task
const rawNonCritical = gulp.series(rawless, function () {
	return gulp.src(`${shutConfig.distUrl}css/${shutConfig.projectName}.css`)
		.pipe(transform(function (contents, file) {
			return critical.CriticalText(contents, false);
		}, { encoding: 'utf8' }))
		// rename to .general
		.pipe(rename({ basename: shutConfig.projectName, suffix: '.general' }))
		.pipe(gulp.dest(shutConfig.distUrl + 'css/'));
	// .on('error', console.error.bind(console));
});

const rawCritical = function () {
	return gulp.src(`${shutConfig.distUrl}css/${shutConfig.projectName}.css`)
		.pipe(transform(function (contents, file) {
			return critical.CriticalText(contents, true);
		}, { encoding: 'utf8' }))
		// rename to .general
		.pipe(rename({ basename: shutConfig.projectName, suffix: '.critical' }))
		.pipe(gulp.dest(shutConfig.distUrl + 'css/'));
	// .on('error', console.error.bind(console));
};

const rawNonCriticalRtl = gulp.series(rawMirror, function () {
	return gulp.src(`${shutConfig.distUrl}css/${shutConfig.projectName}.rtl.css`)
		.pipe(transform(function (contents, file) {
			return critical.CriticalText(contents, false);
		}, { encoding: 'utf8' }))
		// rename to .general
		.pipe(rename({ basename: shutConfig.projectName, suffix: '.general.rtl' }))
		.pipe(gulp.dest(shutConfig.distUrl + 'css/'));
	// .on('error', console.error.bind(console));
});

const rawCriticalRtl = function () {
	return gulp.src(`${shutConfig.distUrl}css/${shutConfig.projectName}.rtl.css`)
		.pipe(transform(function (contents, file) {
			return critical.CriticalText(contents, true);
		}, { encoding: 'utf8' }))
		// rename to .general
		.pipe(rename({ basename: shutConfig.projectName, suffix: '.critical.rtl' }))
		.pipe(gulp.dest(shutConfig.distUrl + 'css/'))
		.on('error', console.error.bind(console));
};

const buildcss = function () {
	// minify the disturl and place in minisite public
	// this step is not part of the shut, but rather the working environment of every project
	return gulp
		.src(`${shutConfig.distUrl}css/${shutConfig.projectName}.css`)
		.pipe(cleancss({
			level: {
				2: {
					all: true
				}
			}
		}))
		.pipe(rename({ basename:  shutConfig.projectName, suffix: '.min' }))
		.pipe(gulp.dest(shutConfig.minDistUrl + 'css'))
		.on('error', console.error.bind(console));
};

const buildRtlcss = function () {
	return gulp
		.src(`${shutConfig.distUrl}css/${shutConfig.projectName}.rtl.css`)
		.pipe(cleancss({
			level: {
				2: {
					all: true
				}
			}
		}))
		.pipe(rename({ basename: shutConfig.projectName, suffix: '.rtl.min' }))
		.pipe(gulp.dest(shutConfig.minDistUrl + 'css'))
		.on('error', console.error.bind(console));

}


module.exports = function(config) {
	shutConfig = config;

	const ret = {};
	
	if (shutConfig.isRtl) {
		// produces both rtl and ltr
		ret.rawless = gulp.series(rawless, rawMirror);
		ret.buildcss = gulp.parallel(buildcss, buildRtlcss);
	
		ret.watch = function () {
			// place code for your default task here
			gulp.watch(shutConfig.srcUrl + 'less/(sh|ui|rtl){1}\.*.less', { ignoreInitial: false }, gulp.series(rawless, rawMirror));
	
		}
		ret.critical = gulp.series(rawNonCritical, rawCritical, rawNonCriticalRtl, rawCriticalRtl);
	
	} else {
	
		ret.rawless = rawless;
		ret.buildcss = buildcss;
		ret.watch = function () {
			// place code for your default task here
			gulp.watch(shutConfig.srcUrl + 'less/(sh|ui){1}\.*.less', { ignoreInitial: false }, rawless);
	
		}
		ret.critical = gulp.series(rawNonCritical, rawCritical);
	}
	return ret;

}

