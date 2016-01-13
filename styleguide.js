var styleguide = require('component-styleguide');
styleguide({
    components: './styleguide/components',
    // components: './public_html/styleguide/components',
    ext: 'html',
    // data: './data',
    staticLocalDir: 'public_html/',
    // staticPath: '../public_html/',
    // staticPath: '/',
    stylesheets: [
        'css/app.css'
    ],
    scripts: [
        'js/vendor.js',
        'js/app.js'
    ]
});