var projectName = 'new project',
    dist = 'public_html/',
    gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    helpers = {
        dist: dist,
        moment: require('moment'),
        browserSync: require('browser-sync').create(),
        onError: function (error) {
            plugins.util.beep();
            plugins.util.log(
                plugins.util.colors.red(
                    '[' + projectName + '] Error (' + error.plugin + '): ' + error.message
                )
            );
            this.emit('end');
        },
        showNotification: function(mess) {
            return {
                title: projectName,
                onLast: true,
                message:
                    mess + '\n' +
                    helpers.moment().format('dddd DD MMMM, HH:mm:ss')
            };
        }
    };

function getTask(task) {
    return require('./gulp_tasks/' + task)(gulp, plugins, helpers);
}

// register all the tasks from the gulp_tasks folder. 
gulp.task('browser-sync',                           getTask('browser-sync'));
gulp.task('bs-reload',                              getTask('bs-reload'));
gulp.task('JSHint',                                 getTask('JSHint'));
gulp.task('Minify Scripts',     ['JSHint'],         getTask('minify-scripts'));
gulp.task('Minify Vendor',                          getTask('minify-vendor'));
gulp.task('Minify Styles',                          getTask('minify-styles'));
// gulp.task('Clean Files',                            getTask('clean-files'));
// gulp.task('Copy Files',         ['Clean Files'],    getTask('copy-files'));
// gulp.task('Copy Views',                             getTask('copy-views'));
// gulp.task('Minify Images',                          getTask('minify-images'));
// gulp.task('Minify SVG Images',                      getTask('minify-svg'));
// gulp.task('Upload CSS',         ['Minify Styles'],  getTask('ftp-upload-css'));

// default task to run on gulp. 
gulp.task('default', ['browser-sync'], function() {
    gulp.start('Minify Styles');
    gulp.start('Minify Scripts');
    gulp.start('Minify Vendor');
    gulp.watch('./_src/scripts/**/*.js', ['Minify Scripts', 'bs-reload']);
    gulp.watch('./_src/styles/**/*.less', ['Minify Styles']);
});
