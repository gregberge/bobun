module.exports = function (grunt) {
  'use strict';

  var docco = require('docco');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    less: {
      'default': {
        files: {
          'dist/main.css': 'less/main.less'
        }
      }
    },

    docco: {
      src: ['components/bobun/bobun.js']
    }
  });

  grunt.registerMultiTask('docco', 'Docco', function() {
    docco.document({
      args: this.filesSrc
    }, this.async());
  });

  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask('default', ['less', 'docco']);
};