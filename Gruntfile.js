'use strict';

var path = require('path'),
    port = 8000,
    lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

var folderMount = function folderMount(connect, point) {
  return connect.static(path.resolve(point));
};

var jsfiles = [
  'bootstrap-transition.js',
  'bootstrap-alert.js',
  'bootstrap-button.js',
  'bootstrap-carousel.js',
  'bootstrap-collapse.js',
  'bootstrap-dropdown.js',
  'bootstrap-modal.js',
  'bootstrap-tooltip.js',
  'bootstrap-popover.js',
  'bootstrap-scrollspy.js',
  'bootstrap-tab.js',
  'bootstrap-typeahead.js',
  'bootstrap-affix.js' 
].map(function (file) { return "source/js/" + file; });

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
          'build/blueline.css': ['source/less/blueline.less']
        }
      },
      compressed: {
        options: {
          compile: true,
          compress: true 
        },
        files: {
          'build/blueline.min.css': ['source/less/blueline.less']
        }
      }
    },

    // Uglify
    uglify: {
      uncompressed: {
        options: {
          beautify: true,
          preserveComments: true
        },
        files: {
          'build/blueline.js': jsfiles
        }
      },
      compressed: {
        files: {
          'build/blueline.min.js': jsfiles
        }
      }
    }
  });

  // Load
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-livereload');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-regarde');
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-open');

  // Tasks
  grunt.registerTask('build', ['recess', 'uglify']);
  grunt.registerTask('server', ['livereload-start', 'connect', 'regarde']);
  grunt.registerTask('livereload-less', function () {
    // In order to see the changed, we'll need to push less.js into the list of changed files
    grunt.regarde.changed.push('guide/js/less.js');
    grunt.task.run('livereload');
  });
  grunt.registerTask('default', ['open:dev', 'server']);
};