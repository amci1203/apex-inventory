var browserSync = require('browser-sync').create(),
    gulp = require('gulp'),
    watch = require('gulp-watch');

gulp.task('default', () => {
    gulp.start('watch');
})
gulp.task('cssInject', ['css'], () => {
    return gulp.src('./public/styles.css')
    .pipe(browserSync.stream());
});
gulp.task('scriptsRefresh', ['scripts'], () => {
    browserSync.reload();
})

gulp.task('distView', () => {
    browserSync.init({
        notify: false,
        server: {
            baseDir: 'docs'
        }
    });
})

gulp.task('watch', ['css', 'scripts'], () => {
    browserSync.init({
        notify: false,
        proxy: 'localhost:3000'
    });
    watch('./assets/css/**/*.css', () => {
        gulp.start('cssInject');
    });
    watch('./assets/js/**/*.js', () => {
        gulp.start('scriptsRefresh');
    });
    watch('./views/**/*.pug', () => {
        browserSync.reload();
    });
});
