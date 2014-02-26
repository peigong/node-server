'use strict';

module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    clean: {
      dist: ['dist']
    },
    copy: {
      dist: {
        files: [ 
          { expand: true, cwd: "lib", src: ['**'], dest: 'dist/server' },
          { expand: true, cwd: "tests", src: ['**'], dest: 'dist/server' },
          { expand: true, cwd: "lib/config", src: ['package.json'], dest: 'dist/server' },
          { expand: true, cwd: "lib/config", src: ['dev.json'], dest: 'dist/config' },
          { expand: true, cwd: "lib/config", src: ['log4js.json'], dest: 'dist/config' }
        ]
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task.
  grunt.registerTask('default', ['clean', 'copy']);
};
