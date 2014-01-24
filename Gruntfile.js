
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    clean: {
      server: ['server']
    },
    copy: {
      server: {
        files: [ 
          { expand: true, cwd: "lib", src: ['**'], dest: 'server' }
        ]
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  // Default task.
  grunt.registerTask('default', ['clean', 'copy']);

};
