'use strict';
// Node 0.10+ doesn't like the way AWS buckets work with TLS. (for grunt deploy) We aren't worried about it. 
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

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
  // CDN configuration
  var cdnConfig = {
      path: path.join('..', 'cdn.knightlab.com', 'app', 'libs', 'blueline')
  };

  // JavaScript files
  var jsFiles = [
    'bootstrap-affix.js',
    'bootstrap-alert.js',
    'bootstrap-button.js',
    'bootstrap-carousel.js',
    'bootstrap-collapse.js',
    'bootstrap-dropbown.js',
    'bootstrap-modal.js',
    'bootstrap-scrollspy.js',
    'bootstrap-tab.js',
    'bootstrap-tooltip.js',
    'bootstrap-popover.js',
    'bootstrap-transition.js',
    'bootstrap-typeahead.js',
    'blueline-preheader.js'
  ].map(function (file) { return bluelineConfig.source + "/js/" + file; });

  // Project configuration.
  var knightlab_config = {};
  if (grunt.file.exists('knightlab.json')) {
      knightlab_config = grunt.file.readJSON('knightlab.json')
  } else {
      grunt.log.error("No knightlab.json file found. You will not be able to deploy to S3")
  }
  
  grunt.initConfig({
    // Configs
    pkg: grunt.file.readJSON('package.json'),
    blueline: bluelineConfig,
    knightlab: knightlab_config,
    cdn: cdnConfig,
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
          '<%= blueline.build %>/js/blueline.js': jsFiles
        }
      },
      compressed: {
        files: {
          '<%= blueline.build %>/js/blueline.min.js': jsFiles
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
              '{downloads,css,img,js}/**'
            ]
          },
          {
            expand: true,
            dot: true,
            cwd: '<%= blueline.source %>',
            dest: '<%= blueline.build %>',
            src: [
              '*.html',
              '{img,font,assets}/**'
            ]
          }
        ]
      },
      stg: {
        files: [
          {
            expand: true,
            cwd: '<%= blueline.build %>',
            dest: path.join('<%= cdn.path %>', '<%= pkg.version %>'),
            src: ['css/**', 'font/**', 'js/**', 'preheader.html'],
          }
        ]
      },
      stgLatest: {
        files: [
          {
            expand: true,
            cwd: '<%= blueline.build %>',
            dest: path.join('<%= cdn.path %>', 'latest'),
            src: ['css/**', 'font/**', 'js/**', 'preheader.html'],
          }
        ]
      }
    },
    // Clean
    clean: {
      dist: '<%= blueline.build %>',
      stg: {
        options: { force: true },
        src: [path.join('<%= cdn.path %>', '<%= pkg.version %>')]
      },
      stgLatest: {
        options: { force: true },
        src: path.join('<%= cdn.path %>', 'latest')
      },
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

  // Aliases
  grunt.registerTask('build', ['clean:dist',  'copy:dist', 'recess', 'uglify', 'usemin', 'concat']);
  grunt.registerTask('deploy', ['build', 's3']);
  grunt.registerTask('server', ['livereload-start', 'connect', 'regarde']);
  grunt.registerTask('livereload-less', function () {
    // In order to see the changed, we'll need to push less.js into the list of changed files
    grunt.regarde.changed.push('guide/js/less.js');
    grunt.task.run('livereload');
  });

  grunt.registerTask('check-for-cdn', 'Check for CDN repository', function() {
    // Make sure CDN repo exists
    if(!grunt.file.exists('..', 'cdn.knightlab.com')) {
        grunt.fatal('Could not find local cdn.knightlab.com repository.')
    }
  });
  grunt.registerTask('stage', "Stage the release for deployment to the CDN", ['check-for-cdn', 'build', 'clean:stg', 'copy:stg']);
  grunt.registerTask('stage-latest', "Stage the release for deployment to the CDN, and copy it to the latest directory", ['stage','clean:stgLatest', 'copy:stgLatest']);

  grunt.registerTask('default', ['open:dev', 'server']);
};
