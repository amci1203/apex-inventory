var gulp = require('gulp'),
    webpack = require('webpack-stream');

gulp.task('scripts', (callback) => {
    return gulp.src('./assets/js/app.js')
        .pipe(webpack({
            output: {
                filename: 'app.js',
            },
            module: {
                loaders: [
                    {
                        loader: 'babel',
                        query: {
                            presets: ['es2015']
                        },
                        test: /\.js$/,
                        exclude: /node_modules/
                    }
                ]
            }
        }))
        .pipe(gulp.dest('./public'))
})