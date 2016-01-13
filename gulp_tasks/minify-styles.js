
module.exports = function (gulp, plugins, helpers) {
    return function () {

        return gulp.src('./_src/styles/app.less')

            // create the dev stylesheet
            .pipe(plugins.plumber({ errorHandler: helpers.onError }))
            .pipe(plugins.less())
            .pipe(plugins.concat('app.css'))
            .pipe(gulp.dest( helpers.dist + 'css/'))


            // create the prod stylesheet
            .pipe( plugins.minifyCss({
                //  keepBreaks: true,
                keepSpecialComments: 0,
                processImport: false
            }))
            .pipe( plugins.size() )
            .pipe( plugins.rename('app.min.css'))
            .pipe( gulp.dest( helpers.dist + 'css/'))

            // update the view in the browser. If you are using the minified css, this should be placed lower.
            .pipe( helpers.browserSync.stream())
            
            .pipe( plugins.notify(helpers.showNotification('Styles optimized')));

    };
};