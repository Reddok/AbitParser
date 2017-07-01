module.exports = function(grunt) {

    [
        'grunt-contrib-less',
        'grunt-contrib-cssmin',
        'grunt-contrib-watch'
    ].forEach(function(task) {
        grunt.loadNpmTasks(task);
    });

    grunt.initConfig({

        less: {
            development: {
                options: {
                    customFunctions: {
                        static: function(lessObject, name) {
                            return 'url("' + require('./site/server/libs/mapStatFile').map(name.value) + '")';
                        }
                    }
                },
                files: {
                    'site/server/public/app/css/style.css': 'site/server/less/style.less',
                    'site/server/public/app/css/context-messages.css': 'site/server/less/context-messages.less',
                    'site/server/public/app/css/breadcrumb.css': 'site/server/less/breadcrumb.less',
                    'site/server/public/app/css/tables.css': 'site/server/less/tables.less',
                    'site/server/public/app/css/student-page.css': 'site/server/less/student-page.less',
                    'site/server/public/app/css/search-page.css': 'site/server/less/search-page.less',
                    'site/server/public/app/css/panel.css': 'site/server/less/panel.less',
                    'site/server/public/app/css/navbar.css': 'site/server/less/navbar.less',
                    'site/server/public/app/css/media.css': 'site/server/less/media.less'
                }
            }
        },
        cssmin: {
            combine: {
                files:  {
                    'site/server/public/app/css/bundle.css': ['site/server/public/app/css/**/*.css', '!site/server/public/app/css/bundle*.css']
                }
            },
            minify: {
                src: 'site/server/public/app/css/bundle.css',
                dest: 'site/server/public/app/css/bundle.min.css'
            }
        },
        watch: {
            files: ['site/server/less/*'],
            tasks: ['less', 'cssmin'],
            options: {
                spawn: false,
            }
        }

    });

    grunt.registerTask('default', ["watch"]);

};