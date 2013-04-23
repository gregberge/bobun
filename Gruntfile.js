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
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-simple-mocha');

  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('test', ['simplemocha']);
};