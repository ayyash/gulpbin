const fileinclude = require('gulp-file-include');
var rename = require('gulp-rename');
const gulp = require('gulp');

exports.createLocalIndex = function () {
// wtach local/includes for changes to merge and produce local/index

	return gulp.src(['./local/_index.html'])
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(rename({ basename: 'index' }))
		.pipe(gulp.dest('./local'));
};

exports.watch = function() {
	gulp.watch('./local/includes/*.*',  { ignoreInitial: false }, exports.createLocalIndex);

}