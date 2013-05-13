module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: {
        options: {
          force: false
        },
        files: {
          src: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
        }
      }
    },

    simplemocha: {
      all: {
        src: ['test/**/*']
      }
    },

    uglify: {
      'default': {
        options: {
          sourceMap: 'bobun.min.map',
          sourceMappingURL: 'bobun.min.map'
        },
        files: {
          'bobun.min.js': 'bobun.js'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['simplemocha', 'jshint', 'uglify']);
  grunt.registerTask('test', ['simplemocha']);
};