var gulp = require('gulp');
var concat = require('gulp-concat');
var wrap = require("gulp-wrap");
var uglify = require('gulp-uglify');

var MODULE_NAME = 'bucket';
var FILENAME = MODULE_NAME;

var wrapTmpl = "(function(window, document) {\n'use strict';\n\nvar module = window['" +
    MODULE_NAME + "'] = {};\n\n<%= contents %>\n\n})(this, document);";

gulp.task('bucket', function() {
    gulp.src('./lib/*.js')
        .pipe(concat(FILENAME + '.js'))
        .pipe(wrap(wrapTmpl))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('dev', function() {
    gulp.src('./lib/*.js')
        .pipe(concat(FILENAME + '.js'))
        .pipe(wrap(wrapTmpl))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('prod', function() {
    gulp.src('./lib/*.js')
        .pipe(concat(FILENAME + '.min.js'))
        .pipe(wrap(wrapTmpl))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['dev', 'prod']);
