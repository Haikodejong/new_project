module.exports = function (gulp, plugins, helpers) {
    return function () {
        
        return gulp.src([
                'bower_components/angular/angular.min.js',
                'bower_components/angular-resource/angular-resource.min.js',
                'bower_components/angular-route/angular-route.min.js',
                'bower_components/angular-sanitize/angular-sanitize.min.js',
                'bower_components/bootstrap/dist/css/bootstrap.css',
                'bower_components/google-code-prettify/bin/prettify.min.css',
                'bower_components/google-code-prettify/styles/sons-of-obsidian.css'
            ])
            .pipe( plugins.plumber({ errorHandler: helpers.onError }) )
            .pipe( gulp.dest( helpers.dist + 'assets/vendor/') )
            .pipe( plugins.notify( helpers.showNotification('Files Copied') ));

    };
};