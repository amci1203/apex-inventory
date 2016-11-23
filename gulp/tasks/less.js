const gulp = require('gulp'),
      less = require('gulp-less'),
      watchLess = require('gulp-watch-less');

gulp.task('less', () => {
    return gulp.src('./assets/less/styles.less')
        .pipe(watchLess('./assets/less/styles.less'))
        .pipe(less())
        .on('error', (err) => {
            console.error(err.toString());
            this.emit('end');
        })
        .pipe(gulp.dest('./public'));
})
