'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-regex-rename');
const minifyCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const jshint = require('gulp-jshint');

/* Run all tasks */
gulp.task('default', () => {
    let scss = gulp.watch('./scss/*.scss', gulp.series('scss:build'));
    let es6 = gulp.watch('./es6/*.js', gulp.series('es6:build'));

    scss.on('change', () => {
        gulp.series('es6:build');
    });

    es6.on('change', () => {
        gulp.series('scss:build');
    });
});

/* SASS */

/* Watch SASS for changes */
gulp.task('scss:watch', () => {
    gulp.watch('./scss/*.scss', gulp.series('scss:build'));
});

/* Transpile SASS to CSS and minify */
gulp.task('scss:build', () => {
    return gulp.src('./SCSS/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('CSS'))
    .pipe(minifyCSS())
    .pipe(rename(/\.css$/,'.min.css'))
    .pipe(gulp.dest('CSS'));
});

/* ES6 */

/* Watch ES6 for changes */
gulp.task('es6:watch', () => {
    gulp.watch('./es6/*.js', gulp.series('es6:build'));
});

/* Transpile ES6 to ES5 and minify */
gulp.task('es6:build', () => {
    return gulp.src('./es6/*.js')
    .pipe(jshint())
    .pipe(babel({
      presets: ['@babel/preset-env'],
      babelrc: false
    }))
    .pipe(gulp.dest('js'))
    .pipe(uglify({
      compress: {
        drop_debugger: true,
        drop_console: true
    }}))
    .pipe(rename(/\.js$/,'.min.js'))
    .pipe(gulp.dest('js'));
});
