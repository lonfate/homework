
const loadGruntTasks = require('load-grunt-tasks')
const sass = require('sass')
module.exports = grunt => {
    grunt.initConfig({
        clean: {
            dist: 'dist'
        },
        sass: {
            options: {
                sourceMap: true,
                implementation: sass
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/assets/styles',
                    src: ['*.scss'],
                    dest: 'dist/assets/styles',
                    ext: '.css'
                }]
            }
        },
        babel: {
            options: {
                sourceMap: true,
                presets: ['@babel/preset-env']
            },
            dist: {
                files: {
                    'dist/assets/scripts/main.js': 'src/assets/scripts/main.js'
                }
            }
        },
        watch: {
            sass: {
                files: ['src/assets/styles/*.scss'],
                tasks: ['sass'],
                options: {
                    spawn: false
                }
            },
            scripts: {
                files: ['src/assets/scripts/*.js'],
                tasks: ['babel'],
                options: {
                    spawn: false
                }
            }
        }
    })
    loadGruntTasks(grunt)
    grunt.registerTask('default', ['clean', 'sass', 'babel', 'watch']);
}