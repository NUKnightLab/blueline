'use strict';

// Variables
var path = require('path'),
    port = 8000,
    lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

module.exports = function(grunt) {

  // configurable paths
  var bluelineConfig = {
      source: 'source',
      guide: 'guide',
      build: 'build'
  };

  // Project configuration.
  grunt.initConfig({
    // Configs
    pkg: grunt.file.readJSON('package.json'),
    blueline: bluelineConfig,
    knightlab: grunt.file.readJSON('knightlab.json'),

    // Banner for the top of CSS and JS files
    banner: '/* <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
            ' * <%= pkg.homepage %>\n' +
            ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
            ' */\n',

    // Development server
    connect: {
      livereload: {
        options: {
          port: port,
          middleware: function(connect, options) {
            return [lrSnippet, connect.static(path.resolve('.'))]
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
          '<%= blueline.build %>/js/blueline.js': '<%= blueline.source %>/js/*'
        }
      },
      compressed: {
        files: {
          '<%= blueline.build %>/js/blueline.min.js': '<%= blueline.source %>/js/*'
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
              '{assets,css,img,js}/**'
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

    // Concat
    concat: {
      options: {
        stripBanners: true,
        banner: '<%= banner %>'
      },
      banner: {
        files: {
          '<%= blueline.build %>/js/blueline.js': ['<%= blueline.build %>/js/blueline.js'],
          '<%= blueline.build %>/js/blueline.min.js': ['<%= blueline.build %>/js/blueline.min.js'],
          '<%= blueline.build %>/css/blueline.css': ['<%= blueline.build %>/css/blueline.css'],
          '<%= blueline.build %>/css/blueline.min.css': ['<%= blueline.build %>/css/blueline.min.css']
        }
      }
    },
  });

  // Load all Grunt task
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Define complex tasks
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