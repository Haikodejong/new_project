
module.exports = function (gulp, plugins, helpers) {
    return function () {

        return gulp.src(src_images + '**/*.{png,gif,jpg,jpeg}')
            .pipe( plugins.plumber({ errorHandler: helpers.onError }) )
            .pipe( plugins.cache( plugins.imagemin({
                optimizationLevel: 3,
                progressive: true,
                interlaced: true
            })))
            .pipe( gulp.dest(dist_images))
            .pipe( plugins.notify( helpers.showNotification('Images Minified') ));
    
    };
};