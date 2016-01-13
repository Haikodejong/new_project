module.exports = function (gulp, plugins, helpers) {
    return function () {
    
        var deploy_config = {
            host: '',
            user: '',
            pass: '',
            path: ''
        };

        var conn = ftp.create( {
            host:     deploy_config.host,
            user:     deploy_config.user,
            password: deploy_config.pass,
            parallel: 10,
            log:      plugins.util.log
        });

        var globs = [dist_css + '/**/**.css'];

        return gulp.src(globs, {base: '.', buffer: false})
            .pipe(plugins.plumber({errorHandler: onError}))
            .pipe(conn.newer(deploy_config.remotePath + '/dist/css')) // only upload newer files 
            .pipe(conn.dest(deploy_config.remotePath + '/dist/css'))
            .pipe(size())
            .pipe(plugins.notify(showNotification('Styles Deployed')));

        // gulp.task('deploy_scripts', ['scripts'], function() {
        //     var conn = ftp.create({
        //         host:     deploy_config.host,
        //         user:     deploy_config.user,
        //         password: deploy_config.pass,
        //         parallel: 10,
        //         log:      plugins.util.log
        //     });
         
        //     var globs = [dist_js + '**/**.js'];
         
        //     return gulp.src(globs, {base: '.', buffer: false})
        //         .pipe(plugins.plumber({errorHandler: onError}))
        //         .pipe(conn.newer(deploy_config.remotePath + '/dist/js')) // only upload newer files 
        //         .pipe(conn.dest(deploy_config.remotePath + '/dist/js'))
        //         .pipe(size())
        //         .pipe(plugins.notify(showNotification('Scripts Deployed')));
        // });
                        
    };
};