module.exports = function(grunt) {
    grunt.initConfig({
        express: {
            api: {
                options: {
                    script: 'index.js'
                }
            }
        },
        watch: {
            options: {
                livereload: 9999
            },
            express: {
                files: ['**/*.js', '**/*.less', '!**/node_modules/**'],
                tasks: ['less', 'express:api'],
                options: {
                    spawn: false
                }
            }
        },
        less: {
            production: {
                options: {
                    compress: true,
                    plugins: [
                        new (require('less-plugin-autoprefix'))({browsers: ["last 2 versions"]}),
                        new (require('less-plugin-clean-css'))()
                    ]
                },
                files: {
                    'web/dist/app.min.css': 'web/src/less/app.less'
                }
            }
        },
        sprite:{
            layout: {
                imgPath: './images/sprite-layout.png',
                src: 'web/src/images/layout-*.png',
                dest: 'web/src/images/sprite-layout.png',
                destCss: 'web/src/css/sprite-layout.css'
            },
            home: {
                imgPath: './images/sprite-home.png',
                src: 'web/src/images/home-*.png',
                dest: 'web/src/images/sprite-home.png',
                destCss: 'web/src/css/sprite-home.css'
            },
            about: {
                imgPath: './images/sprite-about.png',
                src: 'web/src/images/about-*.png',
                dest: 'web/src/images/sprite-about.png',
                destCss: 'web/src/css/sprite-about.css'
            },
            contact: {
                imgPath: './images/sprite-contact.png',
                src: 'web/src/images/contact-*.png',
                dest: 'web/src/images/sprite-contact.png',
                destCss: 'web/src/css/sprite-contact.css'
            }
        },
        imagemin: {
            production: {
                files: [{
                    expand: true,
                    flatten: true,
                    cwd: 'web/src/',
                    src: [
                        'images/sprite-*.png',
                        'images/home-sidebar-*.jpg',
                        'images/about-us-*.jpg',
                        'images/contact-*.png'
                    ],
                    dest: 'web/dist/images/'
                }]
            }
        },
        copy: {
            production: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['web/src/fonts/*'],
                        dest: 'web/dist/fonts/'
                    },
                    {
                        expand: true,
                        flatten: false,
                        cwd: 'web/src/',
                        src: ['views/*.*', 'views/**/*.*'],
                        dest: 'web/dist/'
                    }
                ]
            }
        },
        exec: {
            deploy: {
                cmd: function() {
                    if (!grunt.option('key')) {
                        throw new Error('Must provide SSH key to deploy to server: `grunt deploy --key=/path/to/fancliq.pem`');
                    }
                    let commands = [
                        'rsync',
                        '-rave',
                        '"ssh -i ' + grunt.option('key') + '"',
                        '--exclude=".*"',
                        '--exclude="README.md"',
                        '--exclude node_modules/',
                        '--exclude web/src/',
                        '--exclude Gruntfile.js',
                        '../fancliq',
                        'ec2-user@18.221.53.245:/var/www/'
                    ];
                    return commands.join(' ');
                }
            },
            install: {
                cmd: function() {
                    let commands = [
                        'ssh -i ' + grunt.option('key'),
                        'ec2-user@18.221.53.245',
                        '"cd /var/www/fancliq-web; npm install --force; forever restartall;"'
                    ];
                    return commands.join(' ');
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-spritesmith');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('default', ['build', 'express', 'watch']);
    grunt.registerTask('build', ['copy', 'sprite', 'imagemin', 'less']);
    grunt.registerTask('deploy', ['build', 'exec:deploy', 'exec:install']);
};