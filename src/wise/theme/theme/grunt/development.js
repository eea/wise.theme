module.exports = {
  less: {
    development: {
      options: {
          paths: [],
          strictMath: false,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapFileInline: true,
          sourceMapURL: '++theme++wise-theme/less/theme-compiled.less.map',
          sourceMapFilename: 'less/theme-compiled.less.map',
          modifyVars: {
              "isPlone": "false"
          }
      },
      files: {
        'less/theme-compiled.css': 'less/theme.local.less',
      }
    }
  },

  watch: {
    styles: {
      files: [
          'less/*.less',
          'barceloneta/less/*.less',
          'custom/less/*.less'
      ],
      tasks: ['less:development'],
      options: {
        nospawn: true
      }
    }
  }
};
