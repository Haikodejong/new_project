module.exports = function (gulp, plugins, helpers) {
    return function () {

        return gulp.src([

            // vendor files
            './bower_components/modernizr/modernizr.js',
            './bower_components/jquery/dist/jquery.min.js',
            // './bower_components/jquery-ui/jquery-ui.min.js',
            // './bower_components/lodash/lodash.min.js',
            './bower_components/underscore/underscore-min.js',
            // './bower_components/backbone/backbone-min.js',
            // './bower_components/Snap.svg/dist/snap.svg-min.js',
            './bower_components/moment/min/moment.min.js',
            './bower_components/d3/d3.min.js',
            './bower_components/js-xls/dist/xls.min.js'

        ])

            // create the dev script file
            .pipe( plugins.plumber({ errorHandler: helpers.onError }) )
            .pipe( plugins.concat('vendor.js'))
            .pipe( gulp.dest( helpers.dist + 'js/'))

            // create the prod script file
            .pipe( plugins.uglify() )
            .pipe( plugins.size() )
            .pipe( plugins.rename('vendor.min.js'))
            .pipe( gulp.dest( helpers.dist + 'js/'))

            .pipe( plugins.notify( helpers.showNotification('Scripts Minified') ));
            
    };
};