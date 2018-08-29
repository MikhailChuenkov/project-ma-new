var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');

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