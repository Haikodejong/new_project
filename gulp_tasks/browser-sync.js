module.exports = function (gulp, plugins, helpers) {
    return function () {

        helpers.browserSync.init(
            [
                './public_html/**/*.css',
                './public_html/**/*.js'
            ],
            {
                proxy: 'll.staging',
                files: [
                    {
                        match: [
                            helpers.dist + '**/*.html'
                        ],
                        fn: function (event, file) {
                            helpers.browserSync.reload();
                        }
                    }
                ]
            }
        );
        
    };
};