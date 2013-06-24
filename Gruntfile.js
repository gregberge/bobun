'use strict';

var docco = require('docco'),
    fs = require('fs');

module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

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
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask('default', ['build-index', 'docco']);
  grunt.registerTask('build-index', 'Build index.', function () {
    var done = this.async();

    var bobunBower = require('./components/bobun/bower.json');

    fs.writeFile('index.html', grunt.template.process(fs.readFileSync('index-template.html', {encoding: 'utf-8'}), {data: bobunBower}), function (err) {
      done(! err);
    });
  });
};