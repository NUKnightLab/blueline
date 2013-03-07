'use strict';

var path = require('path'),
    port = 8000,
    lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

var folderMount = function folderMount(connect, point) {
  return connect.static(path.resolve(point));
};

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Package info
    pkg: grunt.file.readJSON('package.json'),

    // Server
    connect: {
      livereload: {
        options: {
          port: port,
          middleware: function(connect, options) {
            return [lrSnippet, folderMount(connect, '.')]
          }
        }
      }
    },

    // Open
    open: { 
      dev: {
        path: 'http://localhost:' + port + '/guide/'
      }
    },

    // Regarde (Watch)
    regarde: {
      less: {
        files: '**/*.less',
        tasks: ['livereload-less']
      },
      html: {
        files: '**/*.html',
        tasks: ['livereload']
      }
    },

    // RECESS (Lint and compile)
    recess: {
      uncompressed: {
        options: {
          compile: true
        },
        files: {
          'build/css/blueline.css': ['source/less/blueline.less']
        }
      },
      compressed: {
        options: {
          compile: true,
          compress: true 
        },
        files: {
          'build/css/blueline.min.css': ['source/less/blueline.less']
        }
      }
    }
  });

  // Load
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-livereload');
  grunt.loadNpmTasks('grunt-regarde');
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-open');

  // Tasks
  grunt.registerTask('build', ['recess']);
  grunt.registerTask('server', ['livereload-start', 'connect', 'regarde']);
  grunt.registerTask('livereload-less', function () {
    // In order to see the changed, we'll need to push less.js into the list of changed files
    grunt.regarde.changed.push('guide/js/less.js');
    grunt.task.run('livereload');
  });
  grunt.registerTask('default', ['open:dev', 'server']);
};