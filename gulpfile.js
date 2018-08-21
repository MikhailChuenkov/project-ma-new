var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
const jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var pump = require('pump');
var concat = require('gulp-concat');

var src = {
  scss: 'src/scss/**/*.+(scss|sass)',
  css: 'src/css'
};

gulp.task('scss', function () {
  return gulp.src(src.scss)
    .pipe(sass())
    .pipe(gulp.dest(src.css))
    .pipe(browserSync.reload({srteam: true,}));
});

gulp.task('browserSync', function () {
  browserSync({
    server: {
      baseDir: 'src',
    }
  })
});

gulp.task('watch', ['browserSync'], function () {
  gulp.watch(src.scss, ['scss']);
  gulp.watch('src/*.html', browserSync.reload);
});

gulp.task('lint', function() {
  return gulp.src('./src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('./dist/'));
});

gulp.task('compress', function (cb) {
  pump([
      gulp.src('src/*.js'),
      uglify(),
      gulp.dest('dist/')
    ],
    cb
  );
});

gulp.task('scripts', function() {
  return gulp.src('src/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('dist'));
});