module.exports = function (gulp, plugins, helpers) {
    return function () {

        return gulp.src([

            './_src/scripts/app.fx.js',

            // project scripts
            './_src/scripts/components/**/*.js',

            './_src/scripts/app.js'

        ])

            // create the dev script file
            .pipe( plugins.plumber({ errorHandler: helpers.onError }) )
            .pipe( plugins.concat('app.js'))
            .pipe( gulp.dest( helpers.dist + 'js/'))

            // create the prod script file
            .pipe( plugins.uglify() )
            .pipe( plugins.size() )
            .pipe( plugins.rename('app.min.js'))
            .pipe( gulp.dest( helpers.dist + 'js/'))

            .pipe( plugins.notify( helpers.showNotification('Scripts Minified') ));
            
    };
};