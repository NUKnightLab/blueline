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
  'bootstrap-affix.js',
  'blueline-preheader.js' 
].map(function (file) { return "source/js/" + file; });

module.exports = function(grunt) {

  // configurable paths
  var bluelineConfig = {
      source: 'source',
      guide: 'guide',
      build: 'build'
  };

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    blueline: bluelineConfig,
    knightlab: grunt.file.readJSON('knightlab.json'),

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
        path: 'http://localhost:' + port + '/<%= blueline.guide %>/'
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
          '<%= blueline.build %>/css/blueline.css': ['<%= blueline.source %>/less/blueline.less'],
          '<%= blueline.build %>/css/guide.css': ['<%= blueline.guide %>/less/guide.less']
        }
      },
      compressed: {
        options: {
          compile: true,
          compress: true 
        },
        files: {
          '<%= blueline.build %>/css/blueline.min.css': ['<%= blueline.source %>/less/blueline.less']
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
          '<%= blueline.build %>/js/blueline.js': jsfiles
        }
      },
      compressed: {
        files: {
          '<%= blueline.build %>/js/blueline.min.js': jsfiles
        }
      }
    },

    // S3
    s3: {
      options: {
        key: '<%= knightlab.s3.key %>',
        secret: '<%= knightlab.s3.secret %>',
        bucket: 'blueline.knightlab.com',
        access: 'public-read'
      },
      dist: {
        upload: [
          {
            src: '<%= blueline.build %>/**',
            dest: '/',
            rel: '<%= blueline.build %>'
          }
        ]
      }
    },

    // Usemin
    usemin: {
      html: ['<%= blueline.build %>/**/*.html'],
      options: {
        dirs: ['<%= blueline.build %>']
      }
    },

    // Copy
    copy: {
      dist: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= blueline.guide %>',
            dest: '<%= blueline.build %>',
            src: [
              '.htaccess',
              '**/*.{ico,txt,html}',
              '{css,img,js}/**'
            ]
          },
          {
            expand: true,
            dot: true,
            cwd: '<%= blueline.source %>',
            dest: '<%= blueline.build %>',
            src: [
              '*.html',
              '{img,font}/**'
            ]
          }
        ]
      }
    },

    // Clean
    clean: {
      dist: '<%= blueline.build %>'
    },

    // Package header
    concat: {
      options: {
        stripBanners: true,
        banner: '/* <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? " * " + pkg.homepage : "" %>\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
        ' */\n'
      },
      js: {
        src: ['<%= blueline.build %>/js/blueline.js'],
        dest: '<%= blueline.build %>/js/blueline.js'
      },
      jsMin: {
        src: ['<%= blueline.build %>/js/blueline.min.js'],
        dest: '<%= blueline.build %>/js/blueline.min.js'
      },
      css: {
        src: ['<%= blueline.build %>/css/blueline.css'],
        dest: '<%= blueline.build %>/css/blueline.css'
      },
      cssMin: {
        src: ['<%= blueline.build %>/css/blueline.min.css'],
        dest: '<%= blueline.build %>/css/blueline.min.css'
      }
    },
  });

  // Load
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-livereload');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-regarde');
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-s3');

  // Tasks
  grunt.registerTask('build', ['clean',  'copy', 'recess', 'uglify', 'usemin', 'concat']);
  grunt.registerTask('deploy', ['build', 's3']);
  grunt.registerTask('server', ['livereload-start', 'connect', 'regarde']);
  grunt.registerTask('livereload-less', function () {
    // In order to see the changed, we'll need to push less.js into the list of changed files
    grunt.regarde.changed.push('guide/js/less.js');
    grunt.task.run('livereload');
  });
  grunt.registerTask('default', ['open:dev', 'server']);
};