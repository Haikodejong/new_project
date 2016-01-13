
module.exports = function (gulp, plugins, helpers) {
    return function () {

        return gulp.src(src_images + '**/*.svg')
            .pipe( plugins.plumber({
                errorHandler: onError
            }))
            .pipe( plugins.cache( plugins.svgmin() ))
            .pipe( plugins.size() )
            .pipe( gulp.dest( dist_images ) )
            .pipe( plugins.util.noop() )
            .pipe( plugins.notify( helpers.showNotification('SVG images Minified') ));
    
    };
};