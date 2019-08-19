module.exports = {

  less: {
    production: {
      options: {
        compress: true,
        sourceMap: false
      },
      files: {
          'static/css/theme-compiled.css': 'less/theme.local.less',
      }
    }
  },

  postcss: {
      options: {
          map: true,
          processors: [
              require('autoprefixer')({
                  browsers: ['last 2 versions']
              })
          ]
      },
      dist: {
          src: 'less/*.css'
      }
  },

  concat: {
    scripts: {
      src: [
        'js/**/*.js'
      ],
      dest: 'static/js/theme-compiled.js'
    }
  },

  uglify: {
    scripts: {
      files: [{
        expand: true,
        cwd: 'static/js',
        src: '**/*.js',
        dest: 'static/js'
      }]
    }
  }
};
