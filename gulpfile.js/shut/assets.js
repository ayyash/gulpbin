const gulp = require('gulp');
const less = require('gulp-less');
const cleancss = require('gulp-clean-css');
const rename = require('gulp-rename');
const inject = require('gulp-inject');
const transform = require('../gulp-transform/lib');
const concat = require('gulp-concat');

// reassiging config means this library is one time use, cannot make custom tasks of it
let options = require('../config.json');

// const rtl = require('./rtl.js');
const critical = require('./critical.js');

// use less/sh.imports.less to create a less file of all ui* and media*, then generate src/css/sh.css
const rawless = function () {
	const {srcPath, distPath, cssFileName, shutPath} = options;

	return gulp
		.src(srcPath + 'less/sh.imports.less')
		.pipe(
			inject(gulp.src(srcPath + 'less/ui.*.less', { read: false }), {
				starttag: '// inject:uiless',
				endtag: '// endinject',
				relative: true
			})
		)
		.pipe(
			inject(gulp.src(srcPath + 'less/media.*.less', { read: false }), {
				starttag: '// inject:medialess',
				endtag: '// endinject',
				// FIXME: not working
				retlative: true
			})
		)
		.pipe(rename({ basename: 'all' }))
		.pipe(gulp.dest(srcPath + 'less/'))
		.pipe(
			less({
				paths: [shutPath + 'less/']
			})
		)
		.on('error', function (err) {
			console.log(err);
			this.emit('end');
		})
		.pipe(rename({ basename: cssFileName }))
		.pipe(gulp.dest(distPath + 'css'))
		.on('error', console.error.bind(console));
};

// use all.less, concat to sh.rtl.imports.less, the inject rtl.*.less to generate src/css/sh.rtl.css
const rawlessRtl = function () {
	const {srcPath, shutPath, cssFileName, distPath} = options;

	return gulp.src( srcPath + 'less/sh.rtl.imports.less')
        .pipe(concat('all.rtl.less', { newLine: '' }))
		.pipe(
			inject(gulp.src(srcPath + 'less/rtl.*.less', { read: false }), {
				starttag: '// inject:rtlless',
				endtag: '// endinject',
				relative: true
			})
		)
		.pipe(
			gulp.dest(srcPath + 'less/')
		)
		.pipe(
			less({
				paths: [shutPath + 'less/']
			})
		)
		.on('error', function (err) {
			console.log(err);
			this.emit('end');
		})
		.pipe(rename({ basename: cssFileName, suffix: '.rtl' }))
		.pipe(gulp.dest(distPath + 'css'))
		.on('error', console.error.bind(console));
};

const rawNonCritical = gulp.series(rawless, function () {
	const {cssFileName, distPath} = options;
	return gulp.src(`${distPath}css/${cssFileName}.css`)
		.pipe(transform(function (contents, file) {
			return critical.CriticalText(contents, false);
		}, { encoding: 'utf8' }))
		// rename to .general
		.pipe(rename({ basename: cssFileName, suffix: '.general' }))
		.pipe(gulp.dest(distPath + 'css/'));
	// .on('error', console.error.bind(console));
});

const rawCritical = function () {
	const {distPath, cssFileName} = options;

	return gulp.src(`${distPath}css/${cssFileName}.css`)
		.pipe(transform(function (contents, file) {
			return critical.CriticalText(contents, true);
		}, { encoding: 'utf8' }))
		// rename to .general
		.pipe(rename({ basename: cssFileName, suffix: '.critical' }))
		.pipe(gulp.dest(distPath + 'css/'));
	// .on('error', console.error.bind(console));
};

const rawNonCriticalRtl = function () {
	const {distPath, cssFileName} = options;
	
	return gulp.src(`${distPath}css/${cssFileName}.rtl.css`)
		.pipe(transform(function (contents, file) {
			return critical.CriticalText(contents, false);
		}, { encoding: 'utf8' }))
		// rename to .general
		.pipe(rename({ basename: cssFileName, suffix: '.general.rtl' }))
		.pipe(gulp.dest(distPath + 'css/'));
	// .on('error', console.error.bind(console));
};

const rawCriticalRtl = function () {
	const {distPath, cssFileName} = options;
	return gulp.src(`${distPath}css/${cssFileName}.rtl.css`)
		.pipe(transform(function (contents, file) {
			return critical.CriticalText(contents, true);
		}, { encoding: 'utf8' }))
		// rename to .general
		.pipe(rename({ basename: cssFileName, suffix: '.critical.rtl' }))
		.pipe(gulp.dest(distPath + 'css/'))
		.on('error', console.error.bind(console));
};

const buildcss = function () {
	const {distPath, cssFileName, minifyPath} = options;
	
	// minify the disturl and place in minisite public
	// this step is not part of the shut, but rather the working environment of every project
	return gulp
		.src(`${distPath}css/${cssFileName}.css`)
		.pipe(cleancss())
		.pipe(rename({ basename:  cssFileName, suffix: '.min' }))
		.pipe(gulp.dest(minifyPath + 'css'))
		.on('error', console.error.bind(console));
};

const buildRtlcss = function () {
	const {distPath, cssFileName, minifyPath} = options;
	
	return gulp
		.src(`${distPath}css/${cssFileName}.rtl.css`)
		.pipe(cleancss())
		.pipe(rename({ basename: cssFileName, suffix: '.rtl.min' }))
		.pipe(gulp.dest(minifyPath + 'css'))
		.on('error', console.error.bind(console));

}

module.exports = (config) => {

	// one time use, change if i want more flexibility
	options = {...config.assets};

	const ret = {};
	
	if (options.isRtl) {
		// produces both rtl and ltr
		ret.rawless = gulp.series(rawless, rawlessRtl);
		ret.buildcss = gulp.series(ret.rawless, gulp.parallel(buildcss, buildRtlcss));
	
		ret.watch = function () {
			gulp.watch(options.srcPath + 'less/(sh|ui|rtl){1,}\.*.less', { ignoreInitial: false }, gulp.series(rawless, rawlessRtl));
		}
		ret.critical = gulp.series(rawNonCritical, rawCritical, rawNonCriticalRtl, rawCriticalRtl);
	
	} else {
	
		ret.rawless = rawless;
		ret.buildcss = gulp.series(rawless, buildcss); 
		ret.watch = function () {
			gulp.watch(options.srcPath + 'less/(sh|ui){1,}\.*.less', { ignoreInitial: false }, rawless);
		}
		ret.critical = gulp.series(rawNonCritical, rawCritical);
	}
	return ret;

}

