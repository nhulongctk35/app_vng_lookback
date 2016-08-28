'use strict';

var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    browserSync = require('browser-sync').create();

const $ = gulpLoadPlugins();

gulp.task('sass', function () {
    return gulp.src('./app/styles/**/*.scss')
        .pipe($.sourcemaps.init())
        .pipe($.sass().on('error', $.sass.logError))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest('./public/css'))
        .pipe(gulp.dest('.tmp/styles'))
        .pipe(browserSync.stream());
});

gulp.task('html', function () {
    return gulp.src('app/**/*.html')
        .pipe($.htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('public'));
});

gulp.task('images', function () {
   return gulp.src('app/images/**/*')
       .pipe($.imagemin())
       .pipe(gulp.dest('public/images'));
});

gulp.task('serve', ['sass'], function () {
    browserSync.init({
        server: ['.tmp', 'app']
    });

    gulp.watch('./app/styles/**/*.scss', ['sass']);
    gulp.watch('./app/**/*.html').on('change', browserSync.reload);
});

gulp.task('dist', ['html', 'images'], function () {
   browserSync.init({
       notify: false,
       port: 9000,
       server: {
           baseDir: 'public'
       }
   })
});
