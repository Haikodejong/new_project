module.exports = function (gulp, plugins, helpers) {
    return function () {
                
        return gulp.src([
            './js/**/*.js',
            '!js/raptor.js',
            '!js/vendor/**/*.js',
            '!js/components/**/*.js',
            '!js/plugins/**/*.js',
            '!node_modules/**/*',
            '!bower_components/**/*'
        ])
            .pipe( plugins.plumber({ errorHandler: helpers.onError }) )
            .pipe( plugins.jshint())
            .pipe( plugins.jshint.reporter('default'));
                        
    };
};