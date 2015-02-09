'use strict';

var DepWalker = require('dependency-walker');
var fs = require('fs');
var cp = require('child_process');
/* jshint -W079 */
var Promise = require('es6-promise').Promise;

module.exports = function(grunt){
  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths
  var config = {
    root: '.',
    build: 'build',
    dist: 'dist',
    temp: 'temp',
    test: 'test',
    demo: 'demo',
    src: 'src',
    eol: (process.platform === 'win32') ? 'crlf' : 'lf'
  };

  // update dependencies
  function getDependencies(){
    var walker = new DepWalker({
      directories: ['src'],
      statement: 'require'
    });
    var files = walker.walk();
    files.unshift(config.build+'/start.js');

    // console.log(files);

    return files;
  }
  var dependencies = getDependencies();
  grunt.registerTask('updateDependencies', function(){
    dependencies = getDependencies();
  });


  var runCommand = function(cmd){
    var promise = new Promise(function(resolve, reject){
      cp.exec(cmd, function(error, stdout, stderr){
        if(error){
          grunt.log.error(stderr);
          reject(error);
        }
        else{
          grunt.log.ok(stdout);
          resolve(stdout);
        }
      });
    });
    return promise;
  };

  grunt.initConfig({
    // Project settings
    config: config,

    uglify: {
      dist: {
        options: {
          sourceMap: true,
          banner: '\'use strict\';(function(){',
          footer: '})();',
          exportAll: true
        },
        files: {
          '<%= config.dist %>/inclusive.min.js': dependencies
        }
      }
    },

    concat: {
      temp: {
        options: {
          sourceMap: true,
          banner: '\'use strict\';(function(){',
          footer: '})();'
        },
        files: {
          '<%= config.temp %>/inclusive.js': dependencies
        }
      },
      dist: {
        options: {
          sourceMap: true,
          banner: '\'use strict\';(function(){',
          footer: '})();'
        },
        files: {
          '<%= config.dist %>/inclusive.js': dependencies
        }
      }
    },

    // concat and uglify might produce 'LF' line ending, which produce line ending warning in git.
    // I just hate to see warnings all over the screens.
    lineending: {
      all:{
        options: {
          eol: config.eol,
          overwrite: true
        },
        files: {
          '': ['dist/**/*', 'test/package.json', 'package.json', 'bower.json', 'test/bower.json', 'demo/rest/server/package.json']
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish'),
        verbose: true,

      },
      all: [
        'Gruntfile.js',
        '<%= config.src %>/**/*.js',
        '!<%= config.src %>/vendor/*',
        // 'test/spec/{,*/}*.js'
      ]
    },

    // Run karma in a separate console, I did not use grunt watch task.
    karma: {
      options: {
        configFile: 'karma.conf.js',
        client: {
            mocha: {
                timeout: 2000
            }
        }
      },
      it: {
        options: {
          background: false,
          singleRun: false,
          autoWatch: true,
          files: [
            'bower_components/es6-promise/promise.js',
            'temp/inclusive.js',
            'test/spec/{,*/}*.js'
          ],
        }
      },
      build: {
        options: {
          files: [
            'bower_components/es6-promise/promise.js',
            'dist/inclusive.min.js',
            'test/spec/{,*/}*.js'
          ],
        },
        singleRun: true
      }
    },

    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['bowerInstall']
      },
      js: {
        files: ['<%= config.src %>/**/*.js', '<%= config.build %>/**/*.js', 'demo/**/*'],
        tasks: ['updateDependencies', 'concat:temp', 'jshint'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>',
          nospaces: true,
        },
        files: [
          './{,*/}*.html'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
        options: {
            port: 9000,
            // https://www.npmjs.org/package/grunt-contrib-connect#open
            open: {
                target: 'http://localhost:<%= connect.options.port %>/demo'
            },
            livereload: 35729,
            // Change this to '0.0.0.0' to access the server from outside
            hostname: '0.0.0.0',
            // base: config.root
        },
        livereload: {
          options: {
            middleware: function(connect) {
              return [
                // connect().use('/src', connect.static('./node_modules/dependency-walker/node_modules/topo-sort')),
                // connect().use('/src', connect.static('./build')),
                // connect().use('/src', connect.static('./src'))
                connect.static(config.root),
              ];
            }
          }
        },
        dist: {
          options: {
            base: 'dist',
            livereload: false
          }
        }
    },

    // Automatically inject Bower components into the HTML file
    bowerInstall: {
      app: {
        src: ['index.html'],
        exclude: ['bower_components/bootstrap/dist/js/bootstrap.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= config.dist %>/*',
            '!<%= config.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    }

  });

  // fix the grunt-contrib-concat source map backslash problem. Backslash path not supported in google chrome workspace.
  // Or, place:
  /*
    if(name){
      name = name.replace(/\\/g, '/');
    }
   */
  // into sourcemap.js, _dummyNode() method. replace backslash into forward slash.
  grunt.registerTask('backslash', function(){
    var content = fs.readFileSync('dist/inclusive.js.map')+'';
    var reg = /\\\\/g;
    fs.writeFileSync('dist/inclusive.js.map', content.replace(reg, '/'), 'utf8');
  });

  /**
   * Uglify has the footer appended after sourcemap statement, which break the source map mapping.
   */
  grunt.registerTask('uglifyFooterFix', function(){
    var content = fs.readFileSync('dist/inclusive.min.js')+'';
    content = content.replace('//# sourceMappingURL=inclusive.min.js.map', '');
    content += '//# sourceMappingURL=inclusive.min.js.map';
    fs.writeFileSync('dist/inclusive.min.js', content, 'utf8');
  });

  grunt.registerTask('build', [
    'updateDependencies',
    'concat:dist',
    'uglify:dist',
    'lineending',
    'uglifyFooterFix',
    'karma:build',
  ]);

  grunt.registerTask('default', [
    'clean:server',
    'updateDependencies',
    'concat:temp',
    'jshint',
    'connect:livereload',
    'watch'
  ]);


    // Since the build task will generate new dist files, have to commit to repository
  grunt.registerTask('_commitBuild', function(type){
    var done = this.async();
    var onError = function(msg){
      grunt.fail.warn(msg);
    };
    var commit = function(msg){
      grunt.log.ok(msg);
      runCommand('git commit -m "New build"');
    };
    runCommand('git add -A').then(commit, onError).then(done, onError);
  });

  // use mversion to update both bower.json and package.json,
  // .mversionrc contains hooks will setup tags and push them to remote origin
  grunt.registerTask('_mversion', function(type){
    var done = this.async();
    runCommand('mversion ' + type).then(function(msg){
      grunt.log.ok(msg);
      done();
    }, function(msg){
      grunt.fail.warn(msg);
      done();
    });
  });

  // Use this only when you release a new version of the library.
  // Currently it cannot have custom commit message as the release message.
  grunt.registerTask('release', function(type){
    if(!type){
      grunt.fail.warn('Missing type parameter. e.g., grunt release:patch.');
    }

    grunt.task.run([
      'build',
      '_commitBuild:' + type,
      '_mversion:' + type
    ]);
  });
};