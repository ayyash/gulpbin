// OBSOLETE file
const gulp = require('gulp');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var inject = require('gulp-inject');
var replace = require('gulp-replace');
var shutConfig = require(__dirname + '/shut.config.json');
// change to have srcUrl for minisite only


const getShutScripts = function() {
    var arr = [];
    // add two major files: 0init and behaviors
    arr.push(shutConfig.shutUrl + 'js/_Init.js');
    arr.push(shutConfig.shutUrl + 'js/_behaviors.js');

    shutConfig.scripts.forEach(function(i) {
        arr.push(shutConfig.shutUrl + 'js/sh.' + i + '.js');
    });

    return arr;
};
const shutscripts = function() {
    // get shut scripts into local site sh.js

    return gulp
        .src(getShutScripts())
        .pipe(concat('sh.js', { newLine: '' }))
        .pipe(replace(String.fromCharCode(65279), '')) // BOM bug
        .pipe(gulp.dest(shutConfig.srcUrl + 'js'));
};

const _rawscripts = function() {
    // inject file in html files, all scripts chosen from shut, and those in working folder
    // add dev.js which will make logging active

    return gulp
        .src(shutConfig.srcUrl + '*.html')
        .pipe(
            inject(gulp.src([shutConfig.srcUrl + 'js/sh.js', shutConfig.srcUrl + 'js/ui.*.js'], { read: false }), {
                relative: true
            })
        )
        .pipe(
            inject(gulp.src(shutConfig.srcUrl + 'js/dev.js', { read: false }), { name: 'development', relative: true })
        )
        .pipe(inject(gulp.src(shutConfig.srcUrl + 'js/sh.data.js', { read: false }), { name: 'data', relative: true }))
        .pipe(gulp.dest(shutConfig.srcUrl));
};

exports.rawscripts = gulp.series(shutscripts, _rawscripts);

exports.buildscripts = function() {
    // build scripts into sh.min.js
    return gulp
        .src([shutConfig.srcUrl + 'js/sh.js', shutConfig.srcUrl + 'js/ui.*.js'])
        .pipe(concat('sh.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(shutConfig.distUrl + 'js'));
};

// gulp.task('resources',function(){
//     // clean images and fonts first, and copy over env

//     gulp.src(shutConfig.srcUrl + 'env/*')
//         .pipe(gulp.dest(shutConfig.distUrl + 'js'));

//     return gulp.src([shutConfig.srcUrl + 'fonts/*',
//                     shutConfig.srcUrl + 'images/*'], {base: shutConfig.srcUrl})
//             .pipe(gulp.dest(shutConfig.distUrl));

// });

// gulp.task('dist', ['resources', 'buildless', 'buildscripts'], function () {
//     // inject scripts in html, produce new one, uglify and replace
//     // env folder has special settings for distribution, but dev.js does not have to be present

//     // im not cleaning dist first, because thats a personal preference

//     return gulp.src(shutConfig.srcUrl + '*.html')
//         .pipe(gulp.dest(shutConfig.distUrl))
//         .pipe(inject(
//             gulp.src([shutConfig.distUrl + 'js/sh.min.js', shutConfig.distUrl + 'css/sh.min.css'], { read: false}), {
//                 relative:true,
//                 removeTags: false
//             }))
//         .pipe(inject(gulp.src(shutConfig.distUrl + 'js/dev.js', { read: false }), { name: 'development', relative: true, removeTags: true, empty: true }))
//         .pipe(inject(gulp.src(shutConfig.distUrl + 'js/sh.data.js', { read: false }), { name: 'data', relative: true, removeTags: true, empty:true }))
//         .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
//         .pipe(gulp.dest(shutConfig.distUrl))

// });

// gulp.task('insertcss', function () {
//     // needs to be just once
//     return gulp.src(shutConfig.srcUrl + '*.html')
//         .pipe(
//         inject(
//             gulp.src(shutConfig.srcUrl + 'less/all.css', { read: false }),
//             { relative: true }
//         )
//         )
//         .pipe(gulp.dest(shutConfig.srcUrl));
// });
