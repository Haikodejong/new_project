module.exports = function (gulp, plugins, helpers) {
    return function () {

        var styleguide = require('component-styleguide');
        styleguide({
            // components: './components',
            ext: 'html',
            // data: './data',
            staticLocalDir: '../public_html/css/',
            // staticPath: '/compiled',
            stylesheets: ['app.css'],
            scripts: ['../public_html/js/app.js']
        });
            
    };
};