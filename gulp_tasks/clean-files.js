module.exports = function (gulp, plugins, helpers) {
    return function () {

        return gulp.src( helpers.dist + 'assets/vendor/', {read: false})
            .pipe( plugins.plumber({ errorHandler: helpers.onError }) )
            .pipe( plugins.rimraf({ force: true}) )
            .pipe( plugins.notify( helpers.showNotification('Files Cleaned') ));

    };
};