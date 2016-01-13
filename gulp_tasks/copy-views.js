module.exports = function (gulp, plugins, helpers) {
    return function () {
        
        return gulp.src([
                './source/html-views/**/*.html'
            ])
            .pipe( plugins.plumber({ errorHandler: helpers.onError }) )
            .pipe( gulp.dest( helpers.dist + 'views/') )
            .pipe( helpers.browserSync.stream())
            .pipe( plugins.notify( helpers.showNotification('Views Copied') ));

    };
};