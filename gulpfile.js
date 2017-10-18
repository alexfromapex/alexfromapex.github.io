'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-clean-css');
var babel = require('gulp-babel');
var jsValidate = require('gulp-jsvalidate');
var uglify = require('gulp-uglify');

/* Run all tasks */
gulp.task('default', () => {
    let scss = gulp.watch('./scss/*.scss', ['scss:build']);
    let es6 = gulp.watch('./JS/*.es6.js', ['es6:build']);

    scss.on('change', () => {
        gulp.start('es6:build');
    });

    es6.on('change', () => {
        gulp.start('scss:build');
    });
});

/* SASS */

/* Watch SASS for changes */
gulp.task('scss:watch', () => {
    gulp.watch('./scss/*.scss', ['scss:build']);
});

/* Transpile SASS to CSS and minify */
gulp.task('scss:build', () => {
    return gulp.src('./SCSS/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('CSS'))
    .pipe(minifyCSS())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('CSS'));
});

/* ES6 */

/* Watch ES6 for changes */
gulp.task('es6:watch', () => {
    gulp.watch('./JS/*.es6.js', ['es6:build']);
});

/* Transpile ES6 to ES5 and minify */
gulp.task('es6:build', () => {
    return gulp.src('./JS/*.es6.js')
    .pipe(jsValidate())
    .pipe(babel({
      presets: ['es2015'],
      babelrc: false
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('JS'))
    .pipe(uglify({
      compress: {
        drop_debugger: true,
        drop_console: true
    }}))
    .pipe(gulp.dest('JS'));
});
