module.exports = {

  less: {
    production: {
      options: {
        compress: true,
        sourceMap: false
      },
      files: {
          'less/theme-compiled.css': 'less/theme.local.less',
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
  }
};
