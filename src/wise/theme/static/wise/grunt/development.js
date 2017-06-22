module.exports = {
  less: {
    development: {
      options: {
        compress: false,
        sourceMap: true,
        sourceMapFilename: '<%= path.static %>/css/source.css.map',
        sourceMapURL: './source.css.map'
      },
      files: {
        '<%= path.static %>/css/main.css': '<%= path.src %>/less/*.less',
      }
    }
  },
  concat: {
    scripts: {
      src: [
        '<%= path.src %>/js/**/*.js'
      ],
      dest: '<%= path.static %>/js/main.js'
    }
  },
  // copy: {
  //   scripts: {
  //     files: [
  //       { expand: true,
  //         cwd: '<%= path.src%>/js/',
  //         src: [
  //           'bootstrap.dropdown.js'
  //         ],
  //         dest: '<%= path.static %>/js/'
  //       }
  //     ]
  //   }
  // },
  watch: {
    styles: {
      files: ['<%= path.src %>/less/**/*.less'],
      tasks: ['less:development'],
      options: {
        nospawn: true
      }
    },
    scripts: {
      files: ['<%= path.src %>/js/**/*.js'],
      tasks: ['concat'],
      options: {
        nospawn: true
      }
    },
    templates: {
      files: ['<%= path.static %>/src/tpl/**/*.hbs'],
      tasks: ['template:dev'],
      options: {
        nospawn: true
      }
    }
  }
}
