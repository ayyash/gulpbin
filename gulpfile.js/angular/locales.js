// here is proper gulping

const gulp = require('gulp');
// those plugins are not kept up to date, may be one day we shall replace them?
const rename = require('gulp-rename');
const transform = require('gulp-transform');

const reLTR = /<!-- #LTR -->([\s\S]*?)<!-- #ENDLTR -->/gim;
const reRTL = /<!-- #RTL -->([\s\S]*?)<!-- #ENDRTL -->/gim;
const reLang = /\$lang/gim;
const rePrefix = /\$prefix/gim;
const reBase = /\$basehref/gim;


const getName = function (options, lang) {
	if (options.withFolders) {
		return options.fileName;
	}

	return `index.${lang.name}${options.isUrlBased ? '.url' : ''}.html`
}
// base function, returns a function to be used as a task
const baseFunction = function (options, lang) {
	// read placeholder.html
	return function () {
		// source the placeholder.html
		return gulp.src(options.locales.source).pipe(
			// transform it with speific language
			transform(function (contents, file) {
				// rewrite content with regexp
				if (lang.isRtl) {
					// remove reLTR
					contents = contents.replace(reLTR, '');
					// strip reRTL
					contents = contents.replace(reRTL, '$1');
				} else {
					contents = contents.replace(reRTL, '');
					// strip reLTR
					contents = contents.replace(reLTR, '$1');
				}


				//  replace lang
				contents = contents.replace(reLang, lang.name).replace(rePrefix, options.prefix);;
				// replace base href
				return contents.replace(reBase, options.locales.isUrlBased ? `/${lang.name}/` : '/');

			}, { encoding: 'utf8' }))
			// rename file to index.lang.url.html
			.pipe(rename(getName(options.locales, lang)))
			// save to destination
			.pipe(gulp.dest(options.locales.destination + (options.locales.withFolders ? lang.name : '')));

	};
};

module.exports = function (options) {
	// real life, one option

	const allIndexFiles = options.languages.map(language => baseFunction(options, language));
	// run in parallel
	return gulp.parallel(...allIndexFiles);


};
