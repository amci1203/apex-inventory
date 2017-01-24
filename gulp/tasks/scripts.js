var gulp = require('gulp'),
    webpack = require('webpack');

gulp.task('scripts', function () {
    webpack(require('../../webpack.config.js'), function (err, stats) {
        if (err) {
            console.log(err.toString());
        }
        console.log('Script Packing Done...\n');
        console.log(stats.toString());
        return gulp.src('./public/temp/scripts/admin.js')
            .pipe(gulp.dest('./admin/public/temp/scripts'))
    })
})
